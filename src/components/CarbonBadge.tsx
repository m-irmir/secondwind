import { CarbonSavings } from "@/lib/types";
import { Droplets, Factory, Car } from "lucide-react";

export default function CarbonBadge({ savings }: { savings: CarbonSavings }) {
  const milesDriven = Math.round(savings.co2Kg * 2.73);
  const waterGallons = Math.round(savings.waterLiters / 3.785);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-5 text-white space-y-4">
      <p className="text-xs font-medium uppercase tracking-widest text-indigo-200">
        Manufacturing a new version of this item would produce
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Factory className="w-4 h-4 text-indigo-300" />
            <span className="text-xs text-indigo-200">Factory emissions</span>
          </div>
          <span className="text-2xl font-extrabold">{savings.co2Kg} kg</span>
          <span className="text-sm text-indigo-200 ml-1">CO₂</span>
          <p className="text-xs text-indigo-300 mt-0.5">
            Same as driving a car <span className="text-white font-semibold">{milesDriven} miles</span>
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-indigo-300" />
            <span className="text-xs text-indigo-200">Water consumption</span>
          </div>
          <span className="text-2xl font-extrabold">
            {savings.waterLiters >= 1000
              ? `${(savings.waterLiters / 1000).toFixed(1)}k`
              : savings.waterLiters}
          </span>
          <span className="text-sm text-indigo-200 ml-1">liters</span>
          <p className="text-xs text-indigo-300 mt-0.5">
            That&apos;s <span className="text-white font-semibold">{waterGallons.toLocaleString()} gallons</span>
          </p>
        </div>
      </div>

      <p className="text-sm font-medium text-indigo-100 border-t border-indigo-500 pt-3">
        Buying secondhand means none of this gets produced.
      </p>
    </div>
  );
}
