import { CarbonSavings } from "@/lib/types";
import { Droplets, Zap, Recycle } from "lucide-react";

export default function CarbonBadge({ savings }: { savings: CarbonSavings }) {
  return (
    <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 space-y-3">
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{savings.co2Kg} kg CO₂</div>
            <div className="text-xs text-gray-500">saved if bought secondhand</div>
          </div>
        </div>
        <div className="w-px bg-indigo-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
            <Droplets className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {savings.waterLiters >= 1000
                ? `${(savings.waterLiters / 1000).toFixed(1)}k`
                : savings.waterLiters}{" "}
              L water
            </div>
            <div className="text-xs text-gray-500">preserved from manufacturing</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 pt-1">
        <Recycle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <p className="text-xs text-gray-400">
          This item would otherwise end up in a landfill.
        </p>
      </div>
    </div>
  );
}
