/**
 * HalalPlate - Local Halal Food & Restaurant Finder
 * Default Restaurant Directory Dataset
 */

const DEFAULT_RESTAURANTS = [
  {
    id: "hp-01",
    name: "Maroush Gardens & Mezze Lounge",
    cuisine: "Middle Eastern & Lebanese",
    cuisineCategory: "Middle Eastern",
    rating: 4.8,
    reviewCount: 524,
    price: "$$$",
    priceTier: 3,
    halalStatus: "100% Halal Certified",
    halalCertifier: "Halal Food Authority (HFA)",
    alcoholPolicy: "Strictly Alcohol-Free",
    prayerFacility: "Dedicated Prayer Room with Wudhu Area",
    address: "21 Connaught St, Tyburnia",
    neighborhood: "Edgware Road / Marble Arch",
    city: "London",
    postcode: "W2 2AY",
    coordinates: {
      lat: 51.5145,
      lng: -0.1628
    },
    phone: "+44 20 7723 0773",
    website: "https://maroushgardens.example.com",
    openingHours: {
      displayText: "12:00 PM - 11:30 PM",
      schedule: {
        mon: { open: "12:00", close: "23:30" },
        tue: { open: "12:00", close: "23:30" },
        wed: { open: "12:00", close: "23:30" },
        thu: { open: "12:00", close: "23:30" },
        fri: { open: "12:00", close: "00:00" },
        sat: { open: "12:00", close: "00:00" },
        sun: { open: "12:00", close: "23:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description: "An enchanting Lebanese oasis featuring indoor palm trees, authentic charcoal-grilled meats, and rich aromatic cold & hot mezze platters prepared according to centuries-old Beirut traditions.",
    topDishes: [
      { name: "Royal Mixed Charcoal Grill", price: "£26.50", isSignature: true, desc: "Tender lamb cutlets, shish taouk & kafta skewers with spiced saffron rice." },
      { name: "Spiced Lamb Arayes", price: "£11.50", isSignature: false, desc: "Crispy charcoal-baked pita stuffed with minced lamb, parsley & pomegranate molasses." },
      { name: "Grand Mezze Feast", price: "£19.00", isSignature: true, desc: "Hummus Beiruti, Moutabal, crunchy Falafel, and stuffed Vine Leaves." },
      { name: "Fresh Mint & Lemon Crush", price: "£5.50", isSignature: false, desc: "Signature freshly squeezed lemonade with garden mint and crushed ice." }
    ],
    features: ["Dedicated Prayer Room", "Family Friendly", "Outdoor Garden", "Artisanal Mocktails", "Takeaway"]
  },
  {
    id: "hp-02",
    name: "Koyn & Efes Ottoman Charcoal Grill",
    cuisine: "Turkish & Ottoman Grill",
    cuisineCategory: "Turkish",
    rating: 4.9,
    reviewCount: 680,
    price: "$$",
    priceTier: 2,
    halalStatus: "Zabihah Hand-Slaughtered",
    halalCertifier: "Halal Monitoring Committee (HMC)",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Private Prayer Mats & Qibla Direction",
    address: "172 Stoke Newington High St",
    neighborhood: "Stoke Newington",
    city: "London",
    postcode: "N16 7NY",
    coordinates: {
      lat: 51.5623,
      lng: -0.0734
    },
    phone: "+44 20 7254 3999",
    website: "https://koynefes.example.com",
    openingHours: {
      displayText: "11:30 AM - 11:00 PM",
      schedule: {
        mon: { open: "11:30", close: "23:00" },
        tue: { open: "11:30", close: "23:00" },
        wed: { open: "11:30", close: "23:00" },
        thu: { open: "11:30", close: "23:00" },
        fri: { open: "11:30", close: "23:30" },
        sat: { open: "11:30", close: "23:30" },
        sun: { open: "11:30", close: "22:30" }
      }
    },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    description: "Famous for dramatic live open-flame mangal grilling. Serves hand-slaughtered HMC-certified lamb ribs, succulent Adana kebabs, and thin crispy wood-fired lahmacun alongside Turkish hospitality.",
    topDishes: [
      { name: "Sultan Iskender Kebab", price: "£18.50", isSignature: true, desc: "Thinly sliced lamb doner over warm pide bread, drizzled with browned butter & tomato sauce." },
      { name: "Charcoal Lamb Ribs (Kaburga)", price: "£17.90", isSignature: true, desc: "Crispy seasoned lamb ribs charred over silver birchwood embers." },
      { name: "Woodfired Crispy Lahmacun", price: "£5.00", isSignature: false, desc: "Paper-thin Anatolian flatbread topped with minced spiced lamb and sumac onions." },
      { name: "Gaziantep Pistachio Baklava", price: "£7.00", isSignature: false, desc: "Layered filo pastry with emerald Gaziantep pistachios and Maraş dondurma ice cream." }
    ],
    features: ["HMC Certified", "Wood-Fired Oven", "No Alcohol", "Prayer Space", "High Chairs Available"]
  },
  {
    id: "hp-03",
    name: "Tayyabs & Sons Tandoori",
    cuisine: "Pakistani & Punjabi Tandoori",
    cuisineCategory: "Pakistani / Indian",
    rating: 4.7,
    reviewCount: 1420,
    price: "$$",
    priceTier: 2,
    halalStatus: "Muslim-Owned",
    halalCertifier: "100% Halal Verified & Muslim-Owned",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "East London Mosque (2 min walk)",
    address: "83-89 Fieldgate St, Whitechapel",
    neighborhood: "Whitechapel",
    city: "London",
    postcode: "E1 1JU",
    coordinates: {
      lat: 51.5178,
      lng: -0.0632
    },
    phone: "+44 20 7247 9540",
    website: "https://tayyabs.example.com",
    openingHours: {
      displayText: "12:00 PM - 11:30 PM",
      schedule: {
        mon: { open: "12:00", close: "23:30" },
        tue: { open: "12:00", close: "23:30" },
        wed: { open: "12:00", close: "23:30" },
        thu: { open: "12:00", close: "23:30" },
        fri: { open: "12:00", close: "00:00" },
        sat: { open: "12:00", close: "00:00" },
        sun: { open: "12:00", close: "23:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    description: "An East London institution since 1972. Famed nationwide for sizzling cast-iron skillets of spiced tandoori lamb chops, rich Punjabi dry meat, and piping hot garlic naans straight from clay ovens.",
    topDishes: [
      { name: "World-Famous Sizzling Lamb Chops", price: "£14.50", isSignature: true, desc: "Four thick cutlets marinated in ginger, garlic, green chilies and ground spices, served smoking hot." },
      { name: "Lahori Dry Meat Curry", price: "£13.95", isSignature: true, desc: "Slow-reduced tender lamb cooked with roasted coriander, black cardamom, and ginger juliennes." },
      { name: "Karahi Chicken Tikka Masala", price: "£12.50", isSignature: false, desc: "Tandoor-charred chicken simmered in a wok with tomatoes, fenugreek, and green chilies." },
      { name: "Peshawari Peshwa Naan", price: "£4.25", isSignature: false, desc: "Stuffed with sweet almonds, sultanas, desiccated coconut, and brush of ghee." }
    ],
    features: ["Historic Legend", "Muslim-Owned", "Near Grand Mosque", "Fast Seating", "Catering"]
  },
  {
    id: "hp-04",
    name: "Sultan’s Smash & Bun",
    cuisine: "Halal Gourmet Burgers & Shakes",
    cuisineCategory: "Burgers & Fast Food",
    rating: 4.8,
    reviewCount: 412,
    price: "$",
    priceTier: 1,
    halalStatus: "Zabihah Hand-Slaughtered",
    halalCertifier: "Halal Monitoring Committee (HMC)",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Quiet Prayer Room on 1st Floor",
    address: "144 Camden High St",
    neighborhood: "Camden Town",
    city: "London",
    postcode: "NW1 0NE",
    coordinates: {
      lat: 51.5392,
      lng: -0.1425
    },
    phone: "+44 20 7482 1120",
    website: "https://sultansmash.example.com",
    openingHours: {
      displayText: "11:00 AM - 11:00 PM",
      schedule: {
        mon: { open: "11:00", close: "23:00" },
        tue: { open: "11:00", close: "23:00" },
        wed: { open: "11:00", close: "23:00" },
        thu: { open: "11:00", close: "23:00" },
        fri: { open: "11:00", close: "00:00" },
        sat: { open: "11:00", close: "00:00" },
        sun: { open: "11:00", close: "22:30" }
      }
    },
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description: "Crispy lacy-edged 100% Angus smash patties, Nashville hot glazed fried chicken fillets, halal beef bacon, and thick custard milkshakes in an energetic neon-lit atmosphere.",
    topDishes: [
      { name: "The Double Truffle Smash", price: "£10.95", isSignature: true, desc: "Two 3.5oz grass-fed smashed patties, double American cheese, black truffle mayo, caramelized onions." },
      { name: "Nashville Hot Dynamo Bird", price: "£9.80", isSignature: true, desc: "Buttermilk fried chicken breast dipped in cayenne chili oil, crinkle pickles, honey chipotle slaw." },
      { name: "Loaded Halal Bacon Fries", price: "£6.50", isSignature: false, desc: "Hand-cut skin-on fries smothered in warm cheese sauce, crispy beef bacon bits, and jalapeños." },
      { name: "Salted Lotus Biscoff Shake", price: "£5.20", isSignature: false, desc: "Blended dairy soft-serve with Biscoff spread, crushed cookies, and whipped cream." }
    ],
    features: ["HMC Zabihah", "Prayer Room", "Late Night Bites", "Kids Menu", "100% Beef Bacon"]
  },
  {
    id: "hp-05",
    name: "Roti King & Nasi Nusantara",
    cuisine: "Malaysian & Indonesian Street Food",
    cuisineCategory: "Asian (Southeast & East)",
    rating: 4.9,
    reviewCount: 930,
    price: "$",
    priceTier: 1,
    halalStatus: "100% Halal Certified",
    halalCertifier: "Department of Islamic Development (JAKIM recognized)",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Regent's Park Islamic Cultural Centre (8 min walk)",
    address: "40 Doric Way, Euston",
    neighborhood: "Euston / King's Cross",
    city: "London",
    postcode: "NW1 1HG",
    coordinates: {
      lat: 51.5298,
      lng: -0.1332
    },
    phone: "+44 20 7387 2518",
    website: "https://rotiking.example.com",
    openingHours: {
      displayText: "12:00 PM - 10:30 PM",
      schedule: {
        mon: { open: "12:00", close: "22:30" },
        tue: { open: "12:00", close: "22:30" },
        wed: { open: "12:00", close: "22:30" },
        thu: { open: "12:00", close: "22:30" },
        fri: { open: "12:00", close: "23:00" },
        sat: { open: "12:00", close: "23:00" },
        sun: { open: "12:00", close: "22:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    description: "Hypnotic theatrical stretching of paper-flaky buttery roti canai paired with rich coconut mutton curry, comforting beef rendang, and fragrant pandan sambal nasi lemak.",
    topDishes: [
      { name: "Roti Canai with Kari Daging", price: "£9.50", isSignature: true, desc: "Two freshly tossed flaky rotis served with a bowl of slow-cooked spicy beef and potato curry." },
      { name: "Royal Nasi Lemak Ayam Goreng", price: "£12.50", isSignature: true, desc: "Fragrant coconut rice, spiced lemongrass crispy fried chicken, anchovies, peanuts, boiled egg & sambal." },
      { name: "Beef Rendang Tok", price: "£13.50", isSignature: false, desc: "Caramelized beef stewed for 6 hours with toasted coconut (kerisik), galangal, and kaffir lime." },
      { name: "Frothy Pulled Teh Tarik", price: "£3.50", isSignature: false, desc: "Classic Malaysian milk tea pulled back and forth between two stainless vessels to create dense foam." }
    ],
    features: ["Authentic Street Food", "100% Halal Certified", "Vegetarian Options", "Quick Service"]
  },
  {
    id: "hp-06",
    name: "Al-Andaluz Tagine & Couscous",
    cuisine: "Moroccan & North African",
    cuisineCategory: "Moroccan",
    rating: 4.8,
    reviewCount: 388,
    price: "$$",
    priceTier: 2,
    halalStatus: "Muslim-Owned",
    halalCertifier: "Muslim-Owned & Hand-Selected Zabihah",
    alcoholPolicy: "Strictly Alcohol-Free (Moroccan Tea Bar)",
    prayerFacility: "Private Prayer Alcove with Prayer Mats",
    address: "56 Queensway, Bayswater",
    neighborhood: "Bayswater",
    city: "London",
    postcode: "W2 3RY",
    coordinates: {
      lat: 51.5118,
      lng: -0.1884
    },
    phone: "+44 20 7229 1845",
    website: "https://alandaluzmoroccan.example.com",
    openingHours: {
      displayText: "12:30 PM - 11:00 PM",
      schedule: {
        mon: { open: "12:30", close: "23:00" },
        tue: { open: "12:30", close: "23:00" },
        wed: { open: "12:30", close: "23:00" },
        thu: { open: "12:30", close: "23:00" },
        fri: { open: "13:30", close: "23:30" },
        sat: { open: "12:30", close: "23:30" },
        sun: { open: "12:30", close: "22:30" }
      }
    },
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80",
    description: "Step into an intricate Marrakesh riad lined with zellige tilework, brass lanterns, and bubbling tajines filled with slow-cooked lamb shanks, sweet caramelised prunes, and toasted sesame.",
    topDishes: [
      { name: "Slow-Braised Lamb Shank Tagine", price: "£19.50", isSignature: true, desc: "Fall-off-the-bone lamb simmered with honeyed prunes, toasted almonds, sesame seeds and saffron broth." },
      { name: "Fez Chicken Pastilla", price: "£10.50", isSignature: true, desc: "Flaky warka pastry envelope filled with shredded spiced chicken, crushed almonds, cinnamon & icing sugar." },
      { name: "Royal Couscous Seven Vegetables", price: "£16.00", isSignature: false, desc: "Fluffy hand-steamed semolina topped with merguez sausages, tender beef, chickpeas, and squash." },
      { name: "Maghrebi Fresh Mint Tea Ceremony", price: "£4.50", isSignature: false, desc: "High-poured gunpowder green tea steeped with fresh spearmint leaves and raw sugar." }
    ],
    features: ["Prayer Alcove", "Romantic Ambiance", "Muslim-Owned", "No Alcohol", "Private Booths"]
  },
  {
    id: "hp-07",
    name: "Zelman Zabihah Prime Steakhouse",
    cuisine: "Luxury Halal Steakhouse & Grill",
    cuisineCategory: "Steakhouse",
    rating: 4.9,
    reviewCount: 742,
    price: "$$$$",
    priceTier: 4,
    halalStatus: "Zabihah Hand-Slaughtered",
    halalCertifier: "Halal Monitoring Committee (HMC)",
    alcoholPolicy: "Strictly Alcohol-Free (Sommelier Mocktail Cellar)",
    prayerFacility: "Private Executive Prayer Suite with Wudhu",
    address: "18 North Audley St, Mayfair",
    neighborhood: "Mayfair",
    city: "London",
    postcode: "W1K 6WE",
    coordinates: {
      lat: 51.5134,
      lng: -0.1537
    },
    phone: "+44 20 7499 8222",
    website: "https://zelmanzabihah.example.com",
    openingHours: {
      displayText: "12:00 PM - 11:30 PM",
      schedule: {
        mon: { open: "12:00", close: "23:30" },
        tue: { open: "12:00", close: "23:30" },
        wed: { open: "12:00", close: "23:30" },
        thu: { open: "12:00", close: "23:30" },
        fri: { open: "12:00", close: "00:00" },
        sat: { open: "12:00", close: "00:00" },
        sun: { open: "12:00", close: "23:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    description: "London's preeminent luxury halal steakhouse in Mayfair. Serves 45-day Himalayan salt-aged Australian Black Angus, full-blood A5 Japanese Wagyu, and custom-carved tomahawks with zero alcohol on premises.",
    topDishes: [
      { name: "45-Day Dry-Aged Zabihah Ribeye (350g)", price: "£48.00", isSignature: true, desc: "Aged in Himalayan rock salt chambers, seared on cherrywood charcoal with roasted garlic bone butter." },
      { name: "A5 Gunma Japanese Wagyu Sirloin", price: "£85.00", isSignature: true, desc: "100% Halal-certified Japanese Black Cattle sirloin with BMS 11 marbling that melts like silk." },
      { name: "Black Truffle & Bone Marrow Mac", price: "£12.50", isSignature: false, desc: "Cavatappi pasta baked in four artisanal cheeses, rich halal marrow crumb and shaved Norcia truffles." },
      { name: "Smoked Oak Amber Mocktail", price: "£9.50", isSignature: false, desc: "Cold-pressed blood orange, lapsang souchong smoke, charred rosemary, and non-alcoholic bitters." }
    ],
    features: ["HMC Certified", "Fine Dining", "Valet Parking", "Executive Prayer Room", "Zero Alcohol"]
  },
  {
    id: "hp-08",
    name: "Medina Artisanal Bakery & Patisserie",
    cuisine: "Artisan Bakery, Cafe & Brunch",
    cuisineCategory: "Bakery & Cafe",
    rating: 4.8,
    reviewCount: 310,
    price: "$$",
    priceTier: 2,
    halalStatus: "Muslim-Owned",
    halalCertifier: "100% Halal Ingredients & Gelatin-Free",
    alcoholPolicy: "Strictly No Alcohol (Specialty Espresso Bar)",
    prayerFacility: "Quiet Prayer Room upstairs",
    address: "32 Thurloe Pl, South Kensington",
    neighborhood: "South Kensington",
    city: "London",
    postcode: "SW7 2HQ",
    coordinates: {
      lat: 51.4947,
      lng: -0.1718
    },
    phone: "+44 20 7589 1204",
    website: "https://medinabakery.example.com",
    openingHours: {
      displayText: "08:00 AM - 09:00 PM",
      schedule: {
        mon: { open: "08:00", close: "21:00" },
        tue: { open: "08:00", close: "21:00" },
        wed: { open: "08:00", close: "21:00" },
        thu: { open: "08:00", close: "21:00" },
        fri: { open: "08:00", close: "21:30" },
        sat: { open: "08:00", close: "21:30" },
        sun: { open: "08:30", close: "20:30" }
      }
    },
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    description: "A sunlit French-Arabian patisserie crafting 100% alcohol-free and animal gelatin-free viennoiserie, cardamom-infused sourdough, pistachio kunafa croissants, and specialty single-origin coffees.",
    topDishes: [
      { name: "Pistachio Kunafa Twice-Baked Croissant", price: "£6.80", isSignature: true, desc: "Flaky butter croissant stuffed with crispy kataifi, fragrant sweet cheese, and Sicilian pistachio cream." },
      { name: "Saffron Cardamom Morning Bun", price: "£4.50", isSignature: false, desc: "Laminated brioche dough rolled in saffron brown sugar, green cardamom seeds, and orange blossom glaze." },
      { name: "Medina Shakshuka Royale", price: "£13.50", isSignature: true, desc: "Free-range poached eggs nestled in spicy san marzano tomato reduction with crumbled feta & za'atar focaccia." },
      { name: "Authentic Saffron Karak Chai", price: "£4.20", isSignature: false, desc: "Slow-brewed Assam black tea with condensed milk, crushed green cardamom pods, and Iranian saffron threads." }
    ],
    features: ["All-Day Brunch", "Muslim-Owned", "Outdoor Pavement Terrace", "Wi-Fi & Laptop Friendly", "Prayer Room"]
  },
  {
    id: "hp-09",
    name: "Kashgar Silk Road Uyghur Kitchen",
    cuisine: "Uyghur & Central Asian",
    cuisineCategory: "Asian (Southeast & East)",
    rating: 4.8,
    reviewCount: 355,
    price: "$$",
    priceTier: 2,
    halalStatus: "Muslim-Owned",
    halalCertifier: "Muslim-Owned & Operated (100% Halal)",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Dedicated Prayer Space Available",
    address: "24 Rupert St, Soho",
    neighborhood: "Soho / West End",
    city: "London",
    postcode: "W1D 6DH",
    coordinates: {
      lat: 51.5115,
      lng: -0.1331
    },
    phone: "+44 20 7439 8812",
    website: "https://kashgarsilkroad.example.com",
    openingHours: {
      displayText: "12:00 PM - 10:30 PM",
      schedule: {
        mon: { open: "12:00", close: "22:30" },
        tue: { open: "12:00", close: "22:30" },
        wed: { open: "12:00", close: "22:30" },
        thu: { open: "12:00", close: "22:30" },
        fri: { open: "12:00", close: "23:00" },
        sat: { open: "12:00", close: "23:00" },
        sun: { open: "12:00", close: "22:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
    description: "Centuries-old Silk Road gastronomy right in Soho. Witness handmade stretchy laghman noodles thrown across marble counters, fragrant lamb skewers dusted in cumin, and hearty Uyghur polo rice.",
    topDishes: [
      { name: "Hand-Pulled Classic Laghman", price: "£14.20", isSignature: true, desc: "Thick chewy hand-stretched noodles topped with wok-tossed halal beef, bell peppers, tomatoes and garlic chives." },
      { name: "Big Plate Chicken (Da Pan Ji)", price: "£22.00", isSignature: true, desc: "Generous platter of bone-in chicken braised with potatoes, Sichuan peppercorns, dried red chilis & flat ribbons." },
      { name: "Cumin Charred Lamb Skewers (Kawap)", price: "£8.50", isSignature: false, desc: "Three skewers of juicy halal lamb threaded with crisp lamb fat, roasted cumin and chili powder." },
      { name: "Uyghur Polo Rice with Raisins", price: "£12.90", isSignature: false, desc: "Slow-steamed spiced rice with tender braised lamb shank, sweet yellow carrots, and plump Xinjiang raisins." }
    ],
    features: ["Hand-Pulled Noodles", "Muslim-Owned", "No Alcohol", "Central Location", "Generous Portions"]
  },
  {
    id: "hp-10",
    name: "Seoul Halal BBQ & Crispy Wings",
    cuisine: "Halal Korean BBQ & Street Food",
    cuisineCategory: "Asian (Southeast & East)",
    rating: 4.7,
    reviewCount: 460,
    price: "$$",
    priceTier: 2,
    halalStatus: "100% Halal Certified",
    halalCertifier: "Korea Muslim Federation (KMF) & UK Halal Approved",
    alcoholPolicy: "Strictly Alcohol-Free (Boba & Sparklers)",
    prayerFacility: "Quiet Room with Qibla Wall",
    address: "58 Goodge St, Fitzrovia",
    neighborhood: "Fitzrovia / Bloomsbury",
    city: "London",
    postcode: "W1T 4NB",
    coordinates: {
      lat: 51.5204,
      lng: -0.1362
    },
    phone: "+44 20 7636 4410",
    website: "https://seoulhalalbbq.example.com",
    openingHours: {
      displayText: "12:00 PM - 10:30 PM",
      schedule: {
        mon: { open: "12:00", close: "22:30" },
        tue: { open: "12:00", close: "22:30" },
        wed: { open: "12:00", close: "22:30" },
        thu: { open: "12:00", close: "22:30" },
        fri: { open: "12:00", close: "23:00" },
        sat: { open: "12:00", close: "23:00" },
        sun: { open: "12:30", close: "22:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
    description: "Authentic Korean flavors made 100% halal with zero mirin or cooking wine. Savor smokeless tabletop BBQ, crispy double-fried Korean chicken tossed in honey butter or spicy gochujang, and sizzling dolsot bibimbap.",
    topDishes: [
      { name: "Smokeless Bulgogi Beef Platter", price: "£19.50", isSignature: true, desc: "Marinated thinly sliced Angus ribeye cooked table-side with fresh lettuce wraps, ssamjang and garlic." },
      { name: "Honey Butter Korean Crispy Wings", price: "£9.80", isSignature: true, desc: "Double-fried ultra-crispy wings glazed in real acacia honey, clarified butter, and roasted sesame." },
      { name: "Sizzling Dolsot Beef Bibimbap", price: "£13.50", isSignature: false, desc: "Hot stone bowl with crispy rice crust, assorted seasoned namul vegetables, halal beef, and fried egg." },
      { name: "Spicy Tteokbokki with Cheesy Pull", price: "£8.50", isSignature: false, desc: "Chewy cylinder rice cakes stewed in sweet spicy gochujang sauce blanketed with melted mozzarella." }
    ],
    features: ["Tabletop BBQ", "100% Halal Meat", "Zero Alcohol / Mirin-Free", "Student Friendly", "Prayer Space"]
  },
  {
    id: "hp-11",
    name: "Tacos Al-Iman & Birria Cocina",
    cuisine: "Halal Mexican & Birria Cantina",
    cuisineCategory: "Burgers & Fast Food",
    rating: 4.8,
    reviewCount: 512,
    price: "$",
    priceTier: 1,
    halalStatus: "100% Halal Certified",
    halalCertifier: "Certified Halal Beef & Poultry (HMC)",
    alcoholPolicy: "Strictly Alcohol-Free (Fresh Horchata & Aguas Frescas)",
    prayerFacility: "Brick Lane Mosque (3 min walk)",
    address: "104 Brick Ln, Shoreditch",
    neighborhood: "Shoreditch / Brick Lane",
    city: "London",
    postcode: "E1 6RL",
    coordinates: {
      lat: 51.5218,
      lng: -0.0714
    },
    phone: "+44 20 7739 4912",
    website: "https://tacosaliman.example.com",
    openingHours: {
      displayText: "11:30 AM - 11:00 PM",
      schedule: {
        mon: { open: "11:30", close: "23:00" },
        tue: { open: "11:30", close: "23:00" },
        wed: { open: "11:30", close: "23:00" },
        thu: { open: "11:30", close: "23:00" },
        fri: { open: "11:30", close: "23:30" },
        sat: { open: "11:30", close: "23:30" },
        sun: { open: "12:00", close: "22:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    description: "London's viral halal taqueria on Brick Lane. Crispy grilled corn tortillas soaked in spiced beef consomé, loaded with slow-cooked shredded halal brisket, gooey Oaxaca-style cheese, cilantro, and freshly squeezed lime.",
    topDishes: [
      { name: "Famous Quesabirria Tacos (Trio)", price: "£12.50", isSignature: true, desc: "Three crispy dipped tortillas grilled with braised halal beef, melted cheese, onions, and a cup of rich dipping consomé." },
      { name: "Pollo Asado Fire Burrito Bowl", price: "£10.50", isSignature: false, desc: "Char-grilled achiote chicken, lime coriander rice, black beans, pico de gallo, guacamole, and crema." },
      { name: "Birria Loaded Cheese Nachos", price: "£9.80", isSignature: true, desc: "Crisp house tortilla chips piled high with shredded birria beef, pickled jalapeños, queso dip and salsa verde." },
      { name: "House Cinnamon Rice Horchata", price: "£3.80", isSignature: false, desc: "Creamy vanilla-cinnamon rice milk served ice cold with a dash of freshly ground nutmeg." }
    ],
    features: ["HMC Beef", "Gluten-Free Tortillas", "No Alcohol", "Street-Style Vibe", "Fast Takeout"]
  },
  {
    id: "hp-12",
    name: "Bukhara Mandi & Yemeni Kitchen",
    cuisine: "Yemeni & Arabian Gulf Kitchen",
    cuisineCategory: "Middle Eastern",
    rating: 4.9,
    reviewCount: 620,
    price: "$$",
    priceTier: 2,
    halalStatus: "Zabihah Hand-Slaughtered",
    halalCertifier: "Muslim-Owned & Hand-Slaughtered Zabihah",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Large Dedicated Prayer Room with Dedicated Wudhu Station",
    address: "264 Uxbridge Rd, Shepherd's Bush",
    neighborhood: "Shepherd's Bush",
    city: "London",
    postcode: "W12 7JA",
    coordinates: {
      lat: 51.5061,
      lng: -0.2285
    },
    phone: "+44 20 8740 6890",
    website: "https://bukharamandi.example.com",
    openingHours: {
      displayText: "12:00 PM - 11:30 PM",
      schedule: {
        mon: { open: "12:00", close: "23:30" },
        tue: { open: "12:00", close: "23:30" },
        wed: { open: "12:00", close: "23:30" },
        thu: { open: "12:00", close: "23:30" },
        fri: { open: "12:00", close: "00:00" },
        sat: { open: "12:00", close: "00:00" },
        sun: { open: "12:00", close: "23:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    description: "The gold standard for authentic subterranean pit-cooked Yemeni Mandi and Madhbi. Communal floor seating majlis and private family dining rooms where aromatic basmati rice is perfumed with cloves, cardamom and smoke.",
    topDishes: [
      { name: "Traditional Pit-Smoked Lamb Mandi", price: "£16.95", isSignature: true, desc: "Whole lamb shoulder braised in underground tanoor, served atop long-grain spiced mandi rice with sahawiq sauce." },
      { name: "Crispy Charcoal Chicken Madhbi", price: "£12.50", isSignature: true, desc: "Half chicken flattened and seared over smooth volcanic river stones on hot coals, served with spiced rice." },
      { name: "Bubbling Yemeni Saltah Stew", price: "£11.00", isSignature: false, desc: "Clay pot lamb and vegetable stew topped with frothy fenugreek froth (hulbah), served with giant rashoosh flatbread." },
      { name: "Warm Honey & Dates Areeka", price: "£6.50", isSignature: false, desc: "Traditional Arabian dessert of mashed wholewheat pastry, premium dates, pure sidr honey, cream and grated cheddar." }
    ],
    features: ["Traditional Floor Majlis", "Dedicated Wudhu Area", "Separate Family Sections", "Hand-Slaughtered", "Zero Alcohol"]
  },
  {
    id: "hp-13",
    name: "Bangkok Halal Wok & Pho",
    cuisine: "Halal Thai & Vietnamese",
    cuisineCategory: "Asian (Southeast & East)",
    rating: 4.7,
    reviewCount: 295,
    price: "$$",
    priceTier: 2,
    halalStatus: "100% Halal Certified",
    halalCertifier: "Central Islamic Council of Thailand & UK Halal",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Prayer Mats Available Upon Request",
    address: "73 Praed St, Paddington",
    neighborhood: "Paddington",
    city: "London",
    postcode: "W2 1NS",
    coordinates: {
      lat: 51.5165,
      lng: -0.1741
    },
    phone: "+44 20 7402 3311",
    website: "https://bangkokwokpad.example.com",
    openingHours: {
      displayText: "12:00 PM - 10:30 PM",
      schedule: {
        mon: { open: "12:00", close: "22:30" },
        tue: { open: "12:00", close: "22:30" },
        wed: { open: "12:00", close: "22:30" },
        thu: { open: "12:00", close: "22:30" },
        fri: { open: "12:00", close: "23:00" },
        sat: { open: "12:00", close: "23:00" },
        sun: { open: "12:00", close: "22:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant and aromatic Southeast Asian classics crafted with certified halal poultry and beef. Experience wok-heirloom Pad Thai, 12-hour simmered star anise beef pho, and sweet coconut sticky rice with honey mango.",
    topDishes: [
      { name: "Halal Roasted Duck Red Curry", price: "£14.95", isSignature: true, desc: "Succulent halal roast duck simmered in rich coconut red curry with sweet pineapple chunks, lychee and Thai basil." },
      { name: "Saigon 12-Hour Beef Brisket Pho", price: "£13.50", isSignature: true, desc: "Aromatic beef bone broth with flat rice noodles, rare sliced ribeye, braised brisket, fresh herbs and bean sprouts." },
      { name: "Classic Pad Thai Goong", price: "£12.80", isSignature: false, desc: "Wok-charred rice noodles with king prawns, pressed tofu, egg, preserved radish, crushed peanuts and lime wedge." },
      { name: "Sweet Coconut Mango Sticky Rice", price: "£6.50", isSignature: false, desc: "Steamed glutinous rice infused with salted coconut cream served alongside ripe Nam Dok Mai mango." }
    ],
    features: ["100% Halal Duck & Beef", "Gluten-Free Options", "No Alcohol", "Opposite Paddington Station"]
  },
  {
    id: "hp-14",
    name: "Damascus Gate Sweets & Shawarma",
    cuisine: "Syrian Street Food & Artisan Sweets",
    cuisineCategory: "Middle Eastern",
    rating: 4.8,
    reviewCount: 480,
    price: "$",
    priceTier: 1,
    halalStatus: "Muslim-Owned",
    halalCertifier: "Muslim-Owned & Operated (100% Halal)",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Ealing Mosque (4 min walk)",
    address: "48 The Broadway, Ealing",
    neighborhood: "Ealing Broadway",
    city: "London",
    postcode: "W5 5JN",
    coordinates: {
      lat: 51.5141,
      lng: -0.3032
    },
    phone: "+44 20 8567 1944",
    website: "https://damascusgate.example.com",
    openingHours: {
      displayText: "10:30 AM - 11:00 PM",
      schedule: {
        mon: { open: "10:30", close: "23:00" },
        tue: { open: "10:30", close: "23:00" },
        wed: { open: "10:30", close: "23:00" },
        thu: { open: "10:30", close: "23:00" },
        fri: { open: "10:30", close: "23:30" },
        sat: { open: "10:30", close: "23:30" },
        sun: { open: "11:00", close: "22:30" }
      }
    },
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80",
    description: "Authentic Syrian street food perfected over generations in Damascus. Famous for paper-thin Saj shawarma wraps crisped in ghee, airy golden falafel balls, and warm cheese kunafa made before your eyes.",
    topDishes: [
      { name: "Damascene Saj Chicken Shawarma", price: "£7.50", isSignature: true, desc: "Marinated rotisserie chicken wrapped in handmade saj flatbread with potent toum garlic sauce, pickles, and grilled crisp." },
      { name: "Damascus Crispy Falafel Plate", price: "£6.80", isSignature: false, desc: "Six fresh herb falafel patties topped with sesame seeds, tarator tahini, pickled turnip, and warm pita." },
      { name: "Fattah Hummus with Spiced Lamb", price: "£9.20", isSignature: true, desc: "Crispy fried bread layers, warm chickpeas, spiced yoghurt tahini dressing, topped with sizzling ghee pine nuts and minced meat." },
      { name: "Fresh Warm Nabulsi Kunafa", price: "£5.50", isSignature: false, desc: "Stretchy sweet Akkawi cheese encased in orange-scented spun pastry drenched in blossom sugar syrup." }
    ],
    features: ["Authentic Syrian", "Muslim-Owned", "No Alcohol", "Budget Friendly", "Live Kunafa Counter"]
  },
  {
    id: "hp-15",
    name: "Karachi Karahi & Nihari House",
    cuisine: "Pakistani Street Food & Karahi",
    cuisineCategory: "Pakistani / Indian",
    rating: 4.9,
    reviewCount: 710,
    price: "$$",
    priceTier: 2,
    halalStatus: "Zabihah Hand-Slaughtered",
    halalCertifier: "Halal Monitoring Committee (HMC)",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Tooting Islamic Centre (2 min walk)",
    address: "138 Tooting High St",
    neighborhood: "Tooting",
    city: "London",
    postcode: "SW17 0RT",
    coordinates: {
      lat: 51.4279,
      lng: -0.1651
    },
    phone: "+44 20 8672 8820",
    website: "https://karachikarahi.example.com",
    openingHours: {
      displayText: "12:00 PM - 11:30 PM",
      schedule: {
        mon: { open: "12:00", close: "23:30" },
        tue: { open: "12:00", close: "23:30" },
        wed: { open: "12:00", close: "23:30" },
        thu: { open: "12:00", close: "23:30" },
        fri: { open: "12:00", close: "00:00" },
        sat: { open: "12:00", close: "00:00" },
        sun: { open: "12:00", close: "23:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    description: "The heart of South London's Pakistani food corridor. Wok-fired iron karahis made fresh to order with fresh ginger, green chillies and vine tomatoes, alongside melt-in-mouth beef shank nihari.",
    topDishes: [
      { name: "Peshawari Shinwari Mutton Karahi (1kg)", price: "£28.00", isSignature: true, desc: "Fresh mutton cooked in an authentic iron wok with animal tallow fat, ripe tomatoes, black pepper, and green chilies only." },
      { name: "Royal Beef Shank Nihari", price: "£14.50", isSignature: true, desc: "Slow-simmered 10-hour beef shank stew with bone marrow, garnished with ginger juliennes, lemon wedges, and fresh coriander." },
      { name: "Lahori Haleem Special", price: "£11.00", isSignature: false, desc: "Rich slow-cooked porridge of seven grains, lentils, and shredded beef pounded to velvety perfection." },
      { name: "Roghnii Sesame Tandoor Naan", price: "£2.50", isSignature: false, desc: "Fluffy leavened bread brushed with milk, egg wash, white sesame seeds, and melted butter." }
    ],
    features: ["HMC Certified", "Wok Karahi Made to Order", "Family Seating", "Near Tooting Mosque", "Takeout"]
  },
  {
    id: "hp-16",
    name: "Palermo Halal Trattoria & Pizzeria",
    cuisine: "Artisan Italian Pizza & Pasta",
    cuisineCategory: "Italian & European",
    rating: 4.8,
    reviewCount: 360,
    price: "$$",
    priceTier: 2,
    halalStatus: "Halal Meat Only (No Alcohol)",
    halalCertifier: "Certified Halal Meats & Alcohol-Free Kitchen",
    alcoholPolicy: "Strictly Alcohol-Free (Italian Mocktail Spritzes)",
    prayerFacility: "Private Quiet Room Provided",
    address: "92 Upper St, Islington",
    neighborhood: "Islington / Angel",
    city: "London",
    postcode: "N1 0NP",
    coordinates: {
      lat: 51.5367,
      lng: -0.1032
    },
    phone: "+44 20 7359 4488",
    website: "https://palermohalal.example.com",
    openingHours: {
      displayText: "12:00 PM - 11:00 PM",
      schedule: {
        mon: { open: "12:00", close: "23:00" },
        tue: { open: "12:00", close: "23:00" },
        wed: { open: "12:00", close: "23:00" },
        thu: { open: "12:00", close: "23:00" },
        fri: { open: "12:00", close: "23:30" },
        sat: { open: "12:00", close: "23:30" },
        sun: { open: "12:30", close: "22:00" }
      }
    },
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    description: "Rustic Italian dining made accessible to halal diners. Wood-fired Neapolitan sourdough pizzas topped with halal cured bresaola, 8-hour braised beef Bolognese without wine, and alcohol-free mascarpone tiramisu.",
    topDishes: [
      { name: "Halal Bresaola & Truffle Crema Pizza", price: "£16.50", isSignature: true, desc: "San Marzano tomatoes, Fior di Latte mozzarella, shaved halal beef bresaola, fresh rocket, and black truffle oil." },
      { name: "Slow-Braised Beef Ragù Pappardelle", price: "£15.20", isSignature: true, desc: "Wide ribbons of egg pasta tossed with 8-hour slow-cooked halal beef chuck, rosemary, san marzano reduction (no wine)." },
      { name: "Woodfired Pollo Piccante Pizza", price: "£14.50", isSignature: false, desc: "Spicy marinated halal chicken breast, roasted bell peppers, fiery calabrian chillies and basil." },
      { name: "Artisanal Espresso Tiramisu (Alcohol-Free)", price: "£6.80", isSignature: false, desc: "Savoiardi ladyfingers dipped in intense Neapolitan espresso, layered with whipped mascarpone cream and Valrhona cocoa." }
    ],
    features: ["Neapolitan Wood Oven", "Wine-Free Cooking", "Alcohol-Free", "Outdoor Terrace", "Romantic Ambience"]
  },
  {
    id: "hp-17",
    name: "Cinnamon & Saffron Mughlai Dining",
    cuisine: "Fine Dining Mughlai & Awadhi",
    cuisineCategory: "Pakistani / Indian",
    rating: 4.9,
    reviewCount: 495,
    price: "$$$",
    priceTier: 3,
    halalStatus: "100% Halal Certified",
    halalCertifier: "Halal Food Authority (HFA)",
    alcoholPolicy: "Strictly Alcohol-Free (Botanical Tea Lounge)",
    prayerFacility: "Private Prayer Room with Prayer Mats",
    address: "35 King St, Covent Garden",
    neighborhood: "Covent Garden",
    city: "London",
    postcode: "WC2E 8JD",
    coordinates: {
      lat: 51.5119,
      lng: -0.1245
    },
    phone: "+44 20 7836 2200",
    website: "https://cinnamonsaffron.example.com",
    openingHours: {
      displayText: "12:00 PM - 11:00 PM",
      schedule: {
        mon: { open: "12:00", close: "23:00" },
        tue: { open: "12:00", close: "23:00" },
        wed: { open: "12:00", close: "23:00" },
        thu: { open: "12:00", close: "23:00" },
        fri: { open: "12:00", close: "23:30" },
        sat: { open: "12:00", close: "23:30" },
        sun: { open: "12:30", close: "22:30" }
      }
    },
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    description: "Sumptuous Covent Garden dining exploring the regal kitchens of the Mughal emperors. Sealed clay pots of fragrant Awadhi dum biryani, saffron-infused lobster curry, and delicate rose-perfumed desserts.",
    topDishes: [
      { name: "Awadhi Dum Mutton Biryani", price: "£21.50", isSignature: true, desc: "Tender goat cooked with basmati rice, saffron, mace, kewra water, sealed with dough in a clay handi and slow baked." },
      { name: "Murgh Makhani Royale", price: "£18.50", isSignature: true, desc: "Tandoori chicken tikka pieces in a velvety reduction of vine tomatoes, cashew nut cream, honey and dried fenugreek." },
      { name: "Kashmiri Lamb Shank Rogan Josh", price: "£19.95", isSignature: false, desc: "Slow-cooked shank infused with rattan jot cockscomb herb, Kashmiri red chillies, fennel and green cardamom." },
      { name: "Saffron & Pistachio Phirni", price: "£7.50", isSignature: false, desc: "Chilled ground rice pudding cooked with whole milk, saffron, cardamom, set in traditional unglazed terracotta bowls." }
    ],
    features: ["Fine Dining", "Prayer Room", "Covent Garden Heart", "Alcohol-Free Lounge", "Private Dining Room"]
  },
  {
    id: "hp-18",
    name: "Addis Ababa & Somali Grill",
    cuisine: "East African & Somali Cuisine",
    cuisineCategory: "African",
    rating: 4.8,
    reviewCount: 340,
    price: "$",
    priceTier: 1,
    halalStatus: "Muslim-Owned",
    halalCertifier: "Muslim-Owned & Operated (100% Halal)",
    alcoholPolicy: "Strictly No Alcohol Served",
    prayerFacility: "Finsbury Park Mosque (4 min walk)",
    address: "12 Clifton Terrace, Finsbury Park",
    neighborhood: "Finsbury Park",
    city: "London",
    postcode: "N4 3JP",
    coordinates: {
      lat: 51.5654,
      lng: -0.1068
    },
    phone: "+44 20 7272 5590",
    website: "https://addissomali.example.com",
    openingHours: {
      displayText: "11:00 AM - 11:00 PM",
      schedule: {
        mon: { open: "11:00", close: "23:00" },
        tue: { open: "11:00", close: "23:00" },
        wed: { open: "11:00", close: "23:00" },
        thu: { open: "11:00", close: "23:00" },
        fri: { open: "11:00", close: "23:30" },
        sat: { open: "11:00", close: "23:30" },
        sun: { open: "11:30", close: "22:30" }
      }
    },
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant Horn of Africa hospitality. Savor sizzling spiced Somali lamb suqaar served with cumin-scented spiced rice and signature banana, alongside tender Ethiopian beef tibs and tangy sourdough injera.",
    topDishes: [
      { name: "Somali Slow-Roasted Haneed Lamb", price: "£14.50", isSignature: true, desc: "Ultra-tender spiced lamb shank served with fragrant bariis iskukaris (spiced rice), bisbaas hot sauce, and fresh banana." },
      { name: "Ethiopian Beef Tibs with Injera", price: "£13.50", isSignature: true, desc: "Halal beef cubes sautéed with onions, garlic, jalapeño peppers and niter kibbeh herb butter, served on fresh injera." },
      { name: "Crispy Somali Beef Sambusas (3pcs)", price: "£4.50", isSignature: false, desc: "Handcrafted golden pastry triangles filled with seasoned minced beef, onions, leeks, and cumin seeds." },
      { name: "Somali Spiced Cardamom Shaah", price: "£2.50", isSignature: false, desc: "Fragrant sweet black tea brewed with crushed cloves, cinnamon, cardamom pods and milk." }
    ],
    features: ["Authentic Horn of Africa", "Muslim-Owned", "Generous Portions", "Near Mosque", "Family Friendly"]
  }
];

// Helper to determine if a restaurant is currently open
function isRestaurantOpenNow(restaurant) {
  if (!restaurant || !restaurant.openingHours || !restaurant.openingHours.schedule) {
    return false;
  }
  const now = new Date();
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayKey = days[now.getDay()];
  const todaySchedule = restaurant.openingHours.schedule[dayKey];
  
  if (!todaySchedule || !todaySchedule.open || !todaySchedule.close) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = todaySchedule.open.split(':').map(Number);
  const openMinutes = openH * 60 + (openM || 0);

  let [closeH, closeM] = todaySchedule.close.split(':').map(Number);
  let closeMinutes = closeH * 60 + (closeM || 0);

  // If close time is past midnight (e.g. 00:00 or 01:00)
  if (closeMinutes <= openMinutes) {
    closeMinutes += 24 * 60;
  }

  let effectiveCurrent = currentMinutes;
  // If after midnight and closing was past midnight
  if (currentMinutes < openMinutes && closeMinutes > 24 * 60) {
    effectiveCurrent += 24 * 60;
  }

  return effectiveCurrent >= openMinutes && effectiveCurrent < closeMinutes;
}

// Global scope attachment for browser & environment support
if (typeof window !== 'undefined') {
  window.DEFAULT_RESTAURANTS = DEFAULT_RESTAURANTS;
  window.isRestaurantOpenNow = isRestaurantOpenNow;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_RESTAURANTS, isRestaurantOpenNow };
}
