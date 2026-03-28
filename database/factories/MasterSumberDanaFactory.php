<?php

namespace Database\Factories;

use App\Models\MasterSumberDana;
use Illuminate\Database\Eloquent\Factories\Factory;

class MasterSumberDanaFactory extends Factory
{
    protected $model = MasterSumberDana::class;

    public function definition(): array
    {
        return [
            'kode' => strtoupper($this->faker->unique()->lexify('SD???')),
            'nama_sumber' => 'Sumber Dana ' . $this->faker->word(),
        ];
    }
}
