import { Item } from "@/lib/types";
import ItemCard from "./ItemCard";

export default function ItemGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">No items found</p>
        <p className="text-gray-300 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
