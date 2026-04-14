<?php

namespace Database\Factories;

use App\Models\MasterKategori;
use App\Models\MasterRincianObjek;
use Illuminate\Database\Eloquent\Factories\Factory;

class MasterKategoriFactory extends Factory
{
    protected $model = MasterKategori::class;

    public function definition(): array
    {
        return [
            'master_rincian_objek_id' => MasterRincianObjek::factory(),
            'kode_sub_rincian_objek' => str_pad((string) $this->faker->numberBetween(1, 99), 2, '0', STR_PAD_LEFT),
            'nama_kategori' => strtoupper($this->faker->words(2, true)),
            'tipe_kib' => $this->faker->randomElement(['A', 'B', 'C', 'D', 'E', 'F']),
        ];
    }
}
