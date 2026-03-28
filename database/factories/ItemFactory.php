<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\MasterKategori;
use App\Models\MasterRuangan;
use App\Models\MasterSumberDana;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'kategori_id' => MasterKategori::inRandomOrder()->first()->id ?? MasterKategori::factory(),
            'ruangan_id' => MasterRuangan::inRandomOrder()->first()->id ?? MasterRuangan::factory(),
            'sumber_dana_id' => MasterSumberDana::inRandomOrder()->first()->id ?? MasterSumberDana::factory(),
            'kode_barang' => $this->faker->unique()->bothify('??-###'),
            'nama_barang' => $this->faker->words(3, true),
            'nomor_register' => $this->faker->numerify('000###'),
            'kondisi' => $this->faker->randomElement(['Baik', 'Kurang Baik', 'Rusak Berat']),
            'tanggal_perolehan' => $this->faker->date(),
            'harga' => $this->faker->numberBetween(100000, 50000000),
            'asal_usul' => $this->faker->randomElement(['Pembelian BOS', 'Hibah', 'APBD', 'APBN']),
            'keterangan' => $this->faker->sentence(),
        ];
    }
}
