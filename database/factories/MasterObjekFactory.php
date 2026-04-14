<?php

namespace Database\Factories;

use App\Models\MasterObjek;
use Illuminate\Database\Eloquent\Factories\Factory;

class MasterObjekFactory extends Factory
{
    protected $model = MasterObjek::class;

    public function definition(): array
    {
        return [
            'kode_kelompok' => '3',
            'kode_jenis' => (string) $this->faker->numberBetween(1, 6),
            'kode_objek' => str_pad((string) $this->faker->unique()->numberBetween(1, 99), 2, '0', STR_PAD_LEFT),
            'nama_objek' => strtoupper($this->faker->words(2, true)),
        ];
    }
}
