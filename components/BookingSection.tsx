import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function BookingSection() {
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    date: '',
    furnitureItems: [] as string[],
    decorItems: [] as string[],
    theme: '',
    couchType: '',
    guests: '',
    chairType: '',
    tableType: '',
    audience: ''
  });

  const furnitureOptions = [
    "Sofa Set",
    "Dining Table",
    "Armchair",
    "Coffee Table",
    "Bar Stools"
  ];

  const decorOptions = [
    "Event Decor Package",
    "Table Decor"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (
    category: 'furnitureItems' | 'decorItems',
    value: string
  ) => {
    setBookingData(prev => {
      const isSelected = prev[category].includes(value);
      const updated = isSelected
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading('Sending booking request...');

    try {
      const res = await fetch('http://localhost:5000/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingData.name,
          email: bookingData.email,
          message: `
New booking request received:

Name: ${bookingData.name}
Email: ${bookingData.email}
Date: ${bookingData.date}

Furniture Items: ${bookingData.furnitureItems.join(', ') || 'None'}
Decor Items: ${bookingData.decorItems.join(', ') || 'None'}
Theme: ${bookingData.theme}
Couch Type: ${bookingData.couchType}
Guests: ${bookingData.guests}
Chair Type: ${bookingData.chairType}
Table Type: ${bookingData.tableType}
Audience: ${bookingData.audience}
          `.trim()
        }),
      });

      if (res.ok) {
        toast.success("✅ Booking submitted successfully! We'll contact you to confirm details.");
        setBookingData({
          name: '',
          email: '',
          date: '',
          furnitureItems: [],
          decorItems: [],
          theme: '',
          couchType: '',
          guests: '',
          chairType: '',
          tableType: '',
          audience: ''
        });
      } else {
        toast.error("❌ Failed to send booking. Please try again later.");
      }
    } catch (error) {
      toast.error("❌ Error occurred while sending booking.");
    }
  };

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="mb-4">Book a Rental</h2>
          <p className="text-muted-foreground">
            Choose from our wide range of furniture and decor options for your perfect event.
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={bookingData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Rental Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Furniture Items</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {furnitureOptions.map(item => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bookingData.furnitureItems.includes(item)}
                      onChange={() => handleCheckboxChange('furnitureItems', item)}
                      className="form-checkbox text-primary"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Decor Items</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {decorOptions.map(item => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bookingData.decorItems.includes(item)}
                      onChange={() => handleCheckboxChange('decorItems', item)}
                      className="form-checkbox text-primary"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Theme</label>
                <input
                  type="text"
                  name="theme"
                  value={bookingData.theme}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background"
                  placeholder="E.g. Modern, Floral, Luxury"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Couch Type & Color</label>
                <input
                  type="text"
                  name="couchType"
                  value={bookingData.couchType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background"
                  placeholder="E.g. L-shape, Cream"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Decor for How Many People?</label>
                <input
                  type="number"
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background"
                  placeholder="E.g. 30"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Type of Chairs</label>
                <select
                  name="chairType"
                  value={bookingData.chairType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background"
                >
                  <option value="">Choose</option>
                  <option value="Black Plastic">Black Plastic</option>
                  <option value="Tiffany Chairs">Tiffany Chairs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Type of Tables</label>
                <select
                  name="tableType"
                  value={bookingData.tableType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background"
                >
                  <option value="">Choose</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Glass">Glass</option>
                  <option value="Wooden">Wooden</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Event For</label>
                <select
                  name="audience"
                  value={bookingData.audience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background"
                >
                  <option value="">Choose</option>
                  <option value="Adults">Adults</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
