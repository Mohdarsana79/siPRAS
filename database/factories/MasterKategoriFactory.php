<?php

namespace Database\Factories;

use App\Models\MasterKategori;
use Illuminate\Database\Eloquent\Factories\Factory;

class MasterKategoriFactory extends Factory
{
    protected $model = MasterKategori::class;

    public function definition(): array
    {
        return [
            'kode_kategori' => 'K' . $this->faker->unique()->numberBetween(100, 999),
            'nama_kategori' => $this->faker->words(2, true),
            'tipe_kib' => $this->faker->randomElement(['A', 'B', 'C', 'D', 'E', 'F']),
        ];
    }
}
