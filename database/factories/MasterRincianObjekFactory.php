<?php

namespace Database\Factories;

use App\Models\MasterObjek;
use App\Models\MasterRincianObjek;
use Illuminate\Database\Eloquent\Factories\Factory;

class MasterRincianObjekFactory extends Factory
{
    protected $model = MasterRincianObjek::class;

    public function definition(): array
    {
        return [
            'master_objek_id' => MasterObjek::factory(),
            'kode_rincian_objek' => str_pad((string) $this->faker->numberBetween(1, 99), 2, '0', STR_PAD_LEFT),
            'nama_rincian_objek' => strtoupper($this->faker->words(3, true)),
        ];
    }
}
