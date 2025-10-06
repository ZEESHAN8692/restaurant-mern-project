const MenuItemCard = ({ item }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg">
      <h2 className="text-lg font-bold">{item.name}</h2>
      <p className="text-gray-600">₹{item.price}</p>
      <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded">
        Add to Order
      </button>
    </div>
  );
};

export default MenuItemCard;
