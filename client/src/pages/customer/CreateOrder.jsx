import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

// Hardcoded GARMENT_PRICES for preview (would ideally come from API)
const GARMENT_PRICES = {
  Shirt: 50, Pants: 60, Saree: 120, Suit: 200, 
  Jacket: 150, Kurta: 70, Bedsheet: 80, Blanket: 150
};

const GARMENT_TYPES = Object.keys(GARMENT_PRICES);

const CreateOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [garments, setGarments] = useState([{ type: "Shirt", quantity: 1 }]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const addGarment = () => {
    setGarments([...garments, { type: "Shirt", quantity: 1 }]);
  };

  const removeGarment = (index) => {
    if (garments.length > 1) {
      const newGarments = [...garments];
      newGarments.splice(index, 1);
      setGarments(newGarments);
    }
  };

  const updateGarment = (index, field, value) => {
    const newGarments = [...garments];
    newGarments[index][field] = value;
    setGarments(newGarments);
  };

  const totalAmount = garments.reduce((acc, curr) => acc + (GARMENT_PRICES[curr.type] * curr.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/orders", {
        customerName: user.name,
        phone: user.phone,
        garments,
        notes
      });
      toast.success("Order created successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Order</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Garments</h2>
            
            {garments.map((garment, index) => (
              <div key={index} className="flex items-end gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Item Type</label>
                  <select
                    value={garment.type}
                    onChange={(e) => updateGarment(index, "type", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {GARMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type} (₹{GARMENT_PRICES[type]})</option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={garment.quantity}
                    onChange={(e) => updateGarment(index, "quantity", parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGarment(index)}
                  disabled={garments.length === 1}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addGarment}
              className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" /> Add another item
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Additional Notes</h2>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for stains, pressing, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {garments.map((g, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600">{g.quantity}x {g.type}</span>
                  <span className="text-slate-900 font-medium">₹{GARMENT_PRICES[g.type] * g.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-900 font-bold">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">₹{totalAmount}</span>
              </div>
              <p className="text-xs text-slate-500">
                Estimated Delivery: {estimatedDelivery.toLocaleDateString()}
              </p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
