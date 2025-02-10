<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class FilterQueryBuilder
{
    protected $model;

    protected $table;

    public function apply($query, $data)
    {
        $this->model = $query->getModel();
        $this->table = $this->model->getTable();

        if (isset($data['f'])) {
            foreach ($data['f'] as $filter) {
                $filter['match'] = $data['filter_match'] ?? 'and';
                $this->makeFilter($query, $filter);
            }
        }

        $this->makeOrder($query, $data);

        return $query;
    }

    public function contains($filter, $query)
    {
        $filter['query_1'] = addslashes($filter['query_1']);

        return $query->where($filter['column'], 'ILIKE', '%' . $filter['query_1'] . '%', $filter['match']);
    }

    protected function makeOrder($query, $data)
    {
        if ($this->isNestedColumn($data['order_column'])) {
            [$relationship, $column] = explode('.', $data['order_column']);
            $callable = Str::camel($relationship);
            $belongs = $this->model->{$callable}();
            $relatedModel = $belongs->getModel();
            $relatedTable = $relatedModel->getTable();
            $as = "prefix_{$relatedTable}";

            if ($belongs instanceof HasOne && $this->table === 'customers') {
                $foreignKey = str($this->table)->singular()->toString() . '_id';
                $statusTable = str($relatedTable)->replace('updates', 'statuses')->toString();
                $asStatusTable = "prefix_{$statusTable}";
                $statusForeignKey = str($relatedTable)->replace('updates', 'status_id')->toString();
                $query->join(
                    "{$relatedTable} as {$as}",
                    "{$as}.{$foreignKey}",
                    '=',
                    "{$this->table}.id"
                )->join(
                    "{$statusTable} as {$asStatusTable}",
                    "{$as}.{$statusForeignKey}",
                    '=',
                    "{$asStatusTable}.id"
                );

                $data['order_column'] = "{$asStatusTable}.name";
            } elseif ($belongs instanceof BelongsTo && $this->table === 'partner_revenues' && ($column === 'customer' || $column === 'service')) {
                $foreignKey = str($this->table)->singular()->toString() . '_id';
                $nestedTable = str($column)->plural()->toString();
                $asNestedTable = "prefix_{$nestedTable}";
                $nestedForeignKey = str($column)->singular()->toString() . '_id';
                $query->join(
                    "{$relatedTable} as {$as}",
                    "{$as}.id",
                    '=',
                    "{$this->table}.payment_id"
                )->join(
                    "{$nestedTable} as {$asNestedTable}",
                    "{$as}.{$nestedForeignKey}",
                    '=',
                    "{$asNestedTable}.id"
                );

                $data['order_column'] = "{$asNestedTable}.name";
            } elseif ($belongs instanceof BelongsTo) {
                $query->leftJoin(
                    "{$relatedTable} as {$as}",
                    "{$as}.id",
                    '=',
                    "{$this->table}.{$relationship}_id"
                );

                $data['order_column'] = "{$as}.{$column}";
            } else {
                return;
            }
        }

        $query
            ->orderBy($data['order_column'], $data['order_direction'])
            ->select("{$this->table}.*");
    }

    protected function makeFilter($query, $filter)
    {
        if ($this->isNestedColumn($filter['column'])) {
            [$relation, $filter['column']] = explode('.', $filter['column']);
            $callable = Str::camel($relation);
            $filter['match'] = 'and';

            $query->orWhereHas(Str::camel($callable), function ($q) use ($filter) {
                $this->{Str::camel($filter['operator'])}(
                    $filter,
                    $q
                );
            });
        } else {
            $filter['column'] = "{$this->table}.{$filter['column']}";
            $this->{Str::camel($filter['operator'])}(
                $filter,
                $query
            );
        }
    }

    protected function isNestedColumn($column)
    {
        return strpos($column, '.') !== false;
    }
}
