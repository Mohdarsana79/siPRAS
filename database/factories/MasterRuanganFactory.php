<?php

namespace Database\Factories;

use App\Models\MasterRuangan;
use Illuminate\Database\Eloquent\Factories\Factory;

class MasterRuanganFactory extends Factory
{
    protected $model = MasterRuangan::class;

    public function definition(): array
    {
        return [
            'kode_ruangan' => 'R' . $this->faker->unique()->numberBetween(100, 999),
            'nama_ruangan' => $this->faker->company() . ' Room',
            'penanggung_jawab' => $this->faker->name(),
        ];
    }
}
