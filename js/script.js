function money(price) {
    return "Rs. " + Number(price || 0);
}

function orderMoney(price) {
    return "₹" + price;
}

function getFieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : "";
}

const indianStateDistricts = {
    "Andaman and Nicobar Islands": [
        "Nicobars",
        "North And Middle Andaman",
        "South Andamans"
    ],
    "Andhra Pradesh": [
        "Alluri Sitharama Raju",
        "Anakapalli",
        "Ananthapuramu",
        "Annamayya",
        "Bapatla",
        "Chittoor",
        "Dr. B.R. Ambedkar Konaseema",
        "East Godavari",
        "Eluru",
        "Guntur",
        "Kakinada",
        "Krishna",
        "Kurnool",
        "Markapuram",
        "Nandyal",
        "Ntr",
        "Palnadu",
        "Parvathipuram Manyam",
        "Polavaram",
        "Prakasam",
        "Sri Potti Sriramulu Nellore",
        "Sri Sathya Sai",
        "Srikakulam",
        "Tirupati",
        "Visakhapatnam",
        "Vizianagaram",
        "West Godavari",
        "Y.S.R. Kadapa"
    ],
    "Arunachal Pradesh": [
        "Anjaw",
        "Bichom",
        "Changlang",
        "Dibang Valley",
        "East Kameng",
        "East Siang",
        "Kamle",
        "Keyi Panyor",
        "Kra Daadi",
        "Kurung Kumey",
        "Leparada",
        "Lohit",
        "Longding",
        "Lower Dibang Valley",
        "Lower Siang",
        "Lower Subansiri",
        "Namsai",
        "Pakke Kessang",
        "Papum Pare",
        "Shi Yomi",
        "Siang",
        "Tawang",
        "Tirap",
        "Upper Siang",
        "Upper Subansiri",
        "West Kameng",
        "West Siang"
    ],
    "Assam": [
        "Bajali",
        "Baksa",
        "Barpeta",
        "Biswanath",
        "Bongaigaon",
        "Cachar",
        "Charaideo",
        "Chirang",
        "Darrang",
        "Dhemaji",
        "Dhubri",
        "Dibrugarh",
        "Dima Hasao",
        "Goalpara",
        "Golaghat",
        "Hailakandi",
        "Hojai",
        "Jorhat",
        "Kamrup",
        "Kamrup Metro",
        "Karbi Anglong",
        "Kokrajhar",
        "Lakhimpur",
        "Majuli",
        "Marigaon",
        "Nagaon",
        "Nalbari",
        "Sivasagar",
        "Sonitpur",
        "South Salmara Mancachar",
        "Sribhumi",
        "Tamulpur",
        "Tinsukia",
        "Udalguri",
        "West Karbi Anglong"
    ],
    "Bihar": [
        "Araria",
        "Arwal",
        "Aurangabad",
        "Banka",
        "Begusarai",
        "Bhagalpur",
        "Bhojpur",
        "Buxar",
        "Darbhanga",
        "Gaya",
        "Gopalganj",
        "Jamui",
        "Jehanabad",
        "Kaimur (Bhabua)",
        "Katihar",
        "Khagaria",
        "Kishanganj",
        "Lakhisarai",
        "Madhepura",
        "Madhubani",
        "Munger",
        "Muzaffarpur",
        "Nalanda",
        "Nawada",
        "Pashchim Champaran",
        "Patna",
        "Purbi Champaran",
        "Purnia",
        "Rohtas",
        "Saharsa",
        "Samastipur",
        "Saran",
        "Sheikhpura",
        "Sheohar",
        "Sitamarhi",
        "Siwan",
        "Supaul",
        "Vaishali"
    ],
    "Chandigarh": [
        "Chandigarh"
    ],
    "Chhattisgarh": [
        "Balod",
        "Balodabazar-Bhatapara",
        "Balrampur-Ramanujganj",
        "Bastar",
        "Bemetara",
        "Bijapur",
        "Bilaspur",
        "Dakshin Bastar Dantewada",
        "Dhamtari",
        "Durg",
        "Gariyaband",
        "Gaurela-Pendra-Marwahi",
        "Janjgir-Champa",
        "Jashpur",
        "Kabeerdham",
        "Khairagarh-Chhuikhadan-Gandai",
        "Kondagaon",
        "Korba",
        "Korea",
        "Mahasamund",
        "Manendragarh-Chirmiri-Bharatpur(M C B)",
        "Mohla-Manpur-Ambagarh Chouki",
        "Mungeli",
        "Narayanpur",
        "Raigarh",
        "Raipur",
        "Rajnandgaon",
        "Sakti",
        "Sarangarh-Bilaigarh",
        "Sukma",
        "Surajpur",
        "Surguja",
        "Uttar Bastar Kanker"
    ],
    "Dadra and Nagar Haveli and Daman and Diu": [
        "Dadra And Nagar Haveli",
        "Daman",
        "Diu"
    ],
    "Delhi": [
        "Central",
        "Central North",
        "East",
        "New Delhi",
        "North",
        "North East",
        "North West",
        "Old Delhi",
        "Outer North",
        "South",
        "South East",
        "South West",
        "West"
    ],
    "Goa": [
        "Kushavati",
        "North Goa",
        "South Goa"
    ],
    "Gujarat": [
        "Ahmedabad",
        "Amreli",
        "Anand",
        "Arvalli",
        "Banas Kantha",
        "Bharuch",
        "Bhavnagar",
        "Botad",
        "Chhotaudepur",
        "Dahod",
        "Dangs",
        "Devbhumi Dwarka",
        "Gandhinagar",
        "Gir Somnath",
        "Jamnagar",
        "Junagadh",
        "Kachchh",
        "Kheda",
        "Mahesana",
        "Mahisagar",
        "Morbi",
        "Narmada",
        "Navsari",
        "Panch Mahals",
        "Patan",
        "Porbandar",
        "Rajkot",
        "Sabar Kantha",
        "Surat",
        "Surendranagar",
        "Tapi",
        "Vadodara",
        "Valsad",
        "Vav-Tharad"
    ],
    "Haryana": [
        "Ambala",
        "Bhiwani",
        "Charkhi Dadri",
        "Faridabad",
        "Fatehabad",
        "Gurugram",
        "Hansi",
        "Hisar",
        "Jhajjar",
        "Jind",
        "Kaithal",
        "Karnal",
        "Kurukshetra",
        "Mahendragarh",
        "Nuh",
        "Palwal",
        "Panchkula",
        "Panipat",
        "Rewari",
        "Rohtak",
        "Sirsa",
        "Sonipat",
        "Yamunanagar"
    ],
    "Himachal Pradesh": [
        "Bilaspur",
        "Chamba",
        "Hamirpur",
        "Kangra",
        "Kinnaur",
        "Kullu",
        "Lahaul And Spiti",
        "Mandi",
        "Shimla",
        "Sirmaur",
        "Solan",
        "Una"
    ],
    "Jammu and Kashmir": [
        "Anantnag",
        "Bandipora",
        "Baramulla",
        "Budgam",
        "Doda",
        "Ganderbal",
        "Jammu",
        "Kathua",
        "Kishtwar",
        "Kulgam",
        "Kupwara",
        "Poonch",
        "Pulwama",
        "Rajouri",
        "Ramban",
        "Reasi",
        "Samba",
        "Shopian",
        "Srinagar",
        "Udhampur"
    ],
    "Jharkhand": [
        "Bokaro",
        "Chatra",
        "Deoghar",
        "Dhanbad",
        "Dumka",
        "East Singhbum",
        "Garhwa",
        "Giridih",
        "Godda",
        "Gumla",
        "Hazaribagh",
        "Jamtara",
        "Khunti",
        "Koderma",
        "Latehar",
        "Lohardaga",
        "Pakur",
        "Palamu",
        "Ramgarh",
        "Ranchi",
        "Sahebganj",
        "Saraikela Kharsawan",
        "Simdega",
        "West Singhbhum"
    ],
    "Karnataka": [
        "Bagalkote",
        "Ballari",
        "Belagavi",
        "Bengaluru Rural",
        "Bengaluru South",
        "Bengaluru Urban",
        "Bidar",
        "Chamarajanagar",
        "Chikkaballapura",
        "Chikkamagaluru",
        "Chitradurga",
        "Dakshina Kannada",
        "Davanagere",
        "Dharwad",
        "Gadag",
        "Hassan",
        "Haveri",
        "Kalaburagi",
        "Kodagu",
        "Kolar",
        "Koppal",
        "Mandya",
        "Mysuru",
        "Raichur",
        "Shivamogga",
        "Tumakuru",
        "Udupi",
        "Uttara Kannada",
        "Vijayanagara",
        "Vijayapura",
        "Yadgir"
    ],
    "Kerala": [
        "Alappuzha",
        "Ernakulam",
        "Idukki",
        "Kannur",
        "Kasaragod",
        "Kollam",
        "Kottayam",
        "Kozhikode",
        "Malappuram",
        "Palakkad",
        "Pathanamthitta",
        "Thiruvananthapuram",
        "Thrissur",
        "Wayanad"
    ],
    "Ladakh": [
        "Kargil",
        "Leh Ladakh"
    ],
    "Lakshadweep": [
        "Lakshadweep District"
    ],
    "Madhya Pradesh": [
        "Agar-Malwa",
        "Alirajpur",
        "Anuppur",
        "Ashoknagar",
        "Balaghat",
        "Barwani",
        "Betul",
        "Bhind",
        "Bhopal",
        "Burhanpur",
        "Chhatarpur",
        "Chhindwara",
        "Damoh",
        "Datia",
        "Dewas",
        "Dhar",
        "Dindori",
        "Guna",
        "Gwalior",
        "Harda",
        "Indore",
        "Jabalpur",
        "Jhabua",
        "Katni",
        "Khandwa (East Nimar)",
        "Khargone (West Nimar)",
        "MAUGANJ",
        "Maihar",
        "Mandla",
        "Mandsaur",
        "Morena",
        "Narmadapuram",
        "Narsimhapur",
        "Neemuch",
        "Niwari",
        "Pandhurna",
        "Panna",
        "Raisen",
        "Rajgarh",
        "Ratlam",
        "Rewa",
        "Sagar",
        "Satna",
        "Sehore",
        "Seoni",
        "Shahdol",
        "Shajapur",
        "Sheopur",
        "Shivpuri",
        "Sidhi",
        "Singrauli",
        "Tikamgarh",
        "Ujjain",
        "Umaria",
        "Vidisha"
    ],
    "Maharashtra": [
        "Ahilyanagar",
        "Akola",
        "Amravati",
        "Beed",
        "Bhandara",
        "Buldhana",
        "Chandrapur",
        "Chhatrapati Sambhajinagar",
        "Dharashiv",
        "Dhule",
        "Gadchiroli",
        "Gondia",
        "Hingoli",
        "Jalgaon",
        "Jalna",
        "Kolhapur",
        "Latur",
        "Mumbai",
        "Mumbai Suburban",
        "Nagpur",
        "Nanded",
        "Nandurbar",
        "Nashik",
        "Palghar",
        "Parbhani",
        "Pune",
        "Raigad",
        "Ratnagiri",
        "Sangli",
        "Satara",
        "Sindhudurg",
        "Solapur",
        "Thane",
        "Wardha",
        "Washim",
        "Yavatmal"
    ],
    "Manipur": [
        "Bishnupur",
        "Chandel",
        "Churachandpur",
        "Imphal East",
        "Imphal West",
        "Jiribam",
        "Kakching",
        "Kamjong",
        "Kangpokpi",
        "Noney",
        "Pherzawl",
        "Senapati",
        "Tamenglong",
        "Tengnoupal",
        "Thoubal",
        "Ukhrul"
    ],
    "Meghalaya": [
        "East Garo Hills",
        "East Jaintia Hills",
        "East Khasi Hills",
        "Eastern West Khasi Hills",
        "North Garo Hills",
        "Ri Bhoi",
        "South Garo Hills",
        "South West Garo Hills",
        "South West Khasi Hills",
        "West Garo Hills",
        "West Jaintia Hills",
        "West Khasi Hills"
    ],
    "Mizoram": [
        "Aizawl",
        "Champhai",
        "Hnahthial",
        "Khawzawl",
        "Kolasib",
        "Lawngtlai",
        "Lunglei",
        "Mamit",
        "Saitual",
        "Serchhip",
        "Siaha"
    ],
    "Nagaland": [
        "Chumoukedima",
        "Dimapur",
        "Kiphire",
        "Kohima",
        "Longleng",
        "Meluri",
        "Mokokchung",
        "Mon",
        "Niuland",
        "Noklak",
        "Peren",
        "Phek",
        "Shamator",
        "Tseminyu",
        "Tuensang",
        "Wokha",
        "Zunheboto"
    ],
    "Odisha": [
        "Angul",
        "Balangir",
        "Balasore",
        "Bargarh",
        "Bhadrak",
        "Boudh",
        "Cuttack",
        "Deogarh",
        "Dhenkanal",
        "Gajapati",
        "Ganjam",
        "Jagatsinghapur",
        "Jajpur",
        "Jharsuguda",
        "Kalahandi",
        "Kandhamal",
        "Kendrapara",
        "Keonjhar",
        "Khordha",
        "Koraput",
        "Malkangiri",
        "Mayurbhanj",
        "Nabarangpur",
        "Nayagarh",
        "Nuapada",
        "Puri",
        "Rayagada",
        "Sambalpur",
        "Sonepur",
        "Sundargarh"
    ],
    "Puducherry": [
        "Karaikal",
        "Puducherry"
    ],
    "Punjab": [
        "Amritsar",
        "Barnala",
        "Bathinda",
        "Faridkot",
        "Fatehgarh Sahib",
        "Fazilka",
        "Ferozepur",
        "Gurdaspur",
        "Hoshiarpur",
        "Jalandhar",
        "Kapurthala",
        "Ludhiana",
        "Malerkotla",
        "Mansa",
        "Moga",
        "Pathankot",
        "Patiala",
        "Rupnagar",
        "S.A.S Nagar",
        "Sangrur",
        "Shahid Bhagat Singh Nagar",
        "Sri Muktsar Sahib",
        "Tarn Taran"
    ],
    "Rajasthan": [
        "Ajmer",
        "Alwar",
        "Balotra",
        "Banswara",
        "Baran",
        "Barmer",
        "Beawar",
        "Bharatpur",
        "Bhilwara",
        "Bikaner",
        "Bundi",
        "Chittorgarh",
        "Churu",
        "Dausa",
        "Deeg",
        "Dholpur",
        "Didwana-Kuchaman",
        "Dungarpur",
        "Ganganagar",
        "Hanumangarh",
        "Jaipur",
        "Jaisalmer",
        "Jalore",
        "Jhalawar",
        "Jhunjhunu",
        "Jodhpur",
        "Karauli",
        "Khairthal-Tijara",
        "Kota",
        "Kotputli-Behror",
        "Nagaur",
        "Pali",
        "Phalodi",
        "Pratapgarh",
        "Rajsamand",
        "Salumbar",
        "Sawai Madhopur",
        "Sikar",
        "Sirohi",
        "Tonk",
        "Udaipur"
    ],
    "Sikkim": [
        "Gangtok",
        "Gyalshing",
        "Mangan",
        "Namchi",
        "Pakyong",
        "Soreng"
    ],
    "Tamil Nadu": [
        "Ariyalur",
        "Chengalpattu",
        "Chennai",
        "Coimbatore",
        "Cuddalore",
        "Dharmapuri",
        "Dindigul",
        "Erode",
        "Kallakurichi",
        "Kancheepuram",
        "Kanniyakumari",
        "Karur",
        "Krishnagiri",
        "Madurai",
        "Mayiladuthurai",
        "Nagapattinam",
        "Namakkal",
        "Perambalur",
        "Pudukkottai",
        "Ramanathapuram",
        "Ranipet",
        "Salem",
        "Sivaganga",
        "Tenkasi",
        "Thanjavur",
        "The Nilgiris",
        "Theni",
        "Thiruvallur",
        "Thiruvarur",
        "Thoothukkudi",
        "Tiruchirappalli",
        "Tirunelveli",
        "Tirupathur",
        "Tiruppur",
        "Tiruvannamalai",
        "Vellore",
        "Viluppuram",
        "Virudhunagar"
    ],
    "Telangana": [
        "Adilabad",
        "Bhadradri Kothagudem",
        "Hanumakonda",
        "Hyderabad",
        "Jagitial",
        "Jangoan",
        "Jayashankar Bhupalapally",
        "Jogulamba Gadwal",
        "Kamareddy",
        "Karimnagar",
        "Khammam",
        "Kumuram Bheem Asifabad",
        "Mahabubabad",
        "Mahabubnagar",
        "Mancherial",
        "Medak",
        "Medchal Malkajgiri",
        "Mulugu",
        "Nagarkurnool",
        "Nalgonda",
        "Narayanpet",
        "Nirmal",
        "Nizamabad",
        "Peddapalli",
        "Rajanna Sircilla",
        "Ranga Reddy",
        "Sangareddy",
        "Siddipet",
        "Suryapet",
        "Vikarabad",
        "Wanaparthy",
        "Warangal",
        "Yadadri Bhuvanagiri"
    ],
    "Tripura": [
        "Dhalai",
        "Gomati",
        "Khowai",
        "North Tripura",
        "Sepahijala",
        "South Tripura",
        "Unakoti",
        "West Tripura"
    ],
    "Uttar Pradesh": [
        "Agra",
        "Aligarh",
        "Ambedkar Nagar",
        "Amethi",
        "Amroha",
        "Auraiya",
        "Ayodhya",
        "Azamgarh",
        "Baghpat",
        "Bahraich",
        "Ballia",
        "Balrampur",
        "Banda",
        "Bara Banki",
        "Bareilly",
        "Basti",
        "Bhadohi",
        "Bijnor",
        "Budaun",
        "Bulandshahr",
        "Chandauli",
        "Chitrakoot",
        "Deoria",
        "Etah",
        "Etawah",
        "Farrukhabad",
        "Fatehpur",
        "Firozabad",
        "Gautam Buddha Nagar",
        "Ghaziabad",
        "Ghazipur",
        "Gonda",
        "Gorakhpur",
        "Hamirpur",
        "Hapur",
        "Hardoi",
        "Hathras",
        "Jalaun",
        "Jaunpur",
        "Jhansi",
        "Kannauj",
        "Kanpur Dehat",
        "Kanpur Nagar",
        "Kasganj",
        "Kaushambi",
        "Kheri",
        "Kushinagar",
        "Lalitpur",
        "Lucknow",
        "Mahoba",
        "Mahrajganj",
        "Mainpuri",
        "Mathura",
        "Mau",
        "Meerut",
        "Mirzapur",
        "Moradabad",
        "Muzaffarnagar",
        "Pilibhit",
        "Pratapgarh",
        "Prayagraj",
        "Rae Bareli",
        "Rampur",
        "Saharanpur",
        "Sambhal",
        "Sant Kabir Nagar",
        "Shahjahanpur",
        "Shamli",
        "Shrawasti",
        "Siddharthnagar",
        "Sitapur",
        "Sonbhadra",
        "Sultanpur",
        "Unnao",
        "Varanasi"
    ],
    "Uttarakhand": [
        "Almora",
        "Bageshwar",
        "Chamoli",
        "Champawat",
        "Dehradun",
        "Haridwar",
        "Nainital",
        "Pauri Garhwal",
        "Pithoragarh",
        "Rudraprayag",
        "Tehri Garhwal",
        "Udham Singh Nagar",
        "Uttarkashi"
    ],
    "West Bengal": [
        "Alipurduar",
        "Bankura",
        "Birbhum",
        "Cooch Behar",
        "Dakshin Dinajpur",
        "Darjeeling",
        "Hooghly",
        "Howrah",
        "Jalpaiguri",
        "Jhargram",
        "Kalimpong",
        "Kolkata",
        "Malda",
        "Murshidabad",
        "Nadia",
        "North 24 Parganas",
        "Paschim Bardhaman",
        "Paschim Medinipur",
        "Purba Bardhaman",
        "Purba Medinipur",
        "Purulia",
        "South 24 Parganas",
        "Uttar Dinajpur"
    ]
};

function setSelectOptions(select, options, placeholder, selectedValue = "") {
    if (!select) return;

    select.innerHTML = "";
    select.appendChild(new Option(placeholder, ""));

    options.forEach(option => {
        select.appendChild(new Option(option, option));
    });

    if (selectedValue && !options.includes(selectedValue)) {
        select.appendChild(new Option(selectedValue, selectedValue));
    }

    select.value = selectedValue || "";
}

function populateStateOptions(selectedState = "") {
    const stateSelect = document.getElementById("state");
    if (!stateSelect) return;

    setSelectOptions(stateSelect, Object.keys(indianStateDistricts), "Select state", selectedState);
}

function populateDistrictOptions(state = getFieldValue("state"), selectedDistrict = "") {
    const districtSelect = document.getElementById("district");
    if (!districtSelect) return;

    const districts = indianStateDistricts[state] || [];
    const placeholder = state ? "Select district" : "Select state first";

    setSelectOptions(districtSelect, districts, placeholder, selectedDistrict);
    districtSelect.disabled = !state && !selectedDistrict;
}

function initLocationDropdowns(selectedState = getFieldValue("state"), selectedDistrict = getFieldValue("district")) {
    populateStateOptions(selectedState);
    populateDistrictOptions(selectedState || getFieldValue("state"), selectedDistrict);
}

function handleStateChange() {
    populateDistrictOptions(getFieldValue("state"));
    updateOrderSummary();
}

function titleFromValue(value) {
    const labels = {
        friend: "Friend",
        family: "Family",
        partner: "Partner",
        sibling: "Sibling"
    };

    return labels[value] || value || "Not provided";
}

function occasionTitle(value) {
    const labels = {
        birthday: "Birthday",
        love: "Love",
        friend: "Friendship"
    };

    return labels[value] || value || "Not provided";
}

function defaultRelationship(occasion) {
    if (occasion === "love") return "Partner";
    if (occasion === "family") return "Family";
    return occasion ? "Friend" : "";
}

function buildDirectOrderMessage(product, price, details = {}) {
    const occasion = details.occasion || "";
    const relationship = details.relationship || defaultRelationship(occasion);

    return [
        "Hi, I want to order:",
        "",
        `Product: ${product || "Custom Keychain"}`,
        `Name: ${details.name || "Not provided"}`,
        `Occasion: ${occasionTitle(occasion)}`,
        `Relationship: ${titleFromValue(relationship)}`,
        `Price: ${orderMoney(price || 0)}`,
        "",
        "Please confirm my order 🙂"
    ].join("\n");
}

function getDirectOrderDetails() {
    const isGiftFinder = Boolean(document.getElementById("budget"));

    return {
        name: getFieldValue("name") || (isGiftFinder ? localStorage.getItem("giftName") || "" : ""),
        occasion: getFieldValue("occasion") || (isGiftFinder ? localStorage.getItem("giftOccasion") || "" : ""),
        relationship: getFieldValue("relationship") || (isGiftFinder ? localStorage.getItem("giftRelationship") || "" : "")
    };
}

const useBackend = location.protocol === "http:" || location.protocol === "https:";
const adminEmail = "smartornaments.shop@gmail.com";
const ownerEmail = "smartornaments.shop@gmail.com";
const legacyAdminUsername = "admin";
const cartStorageKey = "cart";
const cartItemsStorageKey = "cartItems";
const orderStatuses = ["Processing", "Packed", "Shipped", "Delivered"];
const couponRules = {
    WELCOME10: { type: "percent", value: 10, label: "WELCOME10 - 10% off" },
    SAVE50: { type: "flat", value: 50, label: "SAVE50 - Rs. 50 off" }
};
const festivalCollections = {
    birthday: {
        title: "Birthday Collection",
        types: ["bracelet", "keychain", "name-board-fridge-magnet", "resin-work"],
        keywords: ["birthday", "name", "custom", "photo", "gift"]
    },
    anniversary: {
        title: "Anniversary Collection",
        types: ["bracelet", "resin-work", "name-board-fridge-magnet"],
        keywords: ["anniversary", "love", "couple", "date", "resin"]
    },
    "friendship-day": {
        title: "Friendship Day Collection",
        types: ["bracelet", "keychain", "thread-work-bangle-earrings"],
        keywords: ["friend", "friendship", "band", "keychain", "bracelet"]
    },
    "valentines-day": {
        title: "Valentine's Day Collection",
        types: ["bracelet", "keychain", "resin-work"],
        keywords: ["valentine", "love", "romantic", "heart", "rose"]
    }
};
const orderPhotoStorage = {
    product: null,
    checkout: null
};

function isAdminLoginId(value) {
    const login = String(value || "").toLowerCase();
    return login === adminEmail || login === legacyAdminUsername;
}

async function apiRequest(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const apiBaseUrl = window.SMARTORNAMENTS_API_URL || localStorage.getItem("apiBaseUrl") || "";
    const url = /^https?:\/\//i.test(path) ? path : apiBaseUrl + path;

    if (token) headers.Authorization = "Bearer " + token;

    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.error || "Request failed");
    }

    return data;
}

function isApiUnavailableError(error) {
    return error instanceof TypeError
        || [
            "API route not found",
            "Request failed",
            "Failed to fetch",
            "Product request failed",
            "Order request failed",
            "User request failed",
            "Contact request failed",
            "Notification request failed"
        ].includes(error.message);
}

function getCustomerKey() {
    const user = localStorage.getItem("loggedInUser");
    return user ? user.toLowerCase() : "guest";
}

const productCategories = [
    {
        value: "bracelet",
        label: "Charm Bracelets",
        image: "images/Braclet/Braclet with Charm.jpg",
        description: "Handmade wrist candy with names, charms, and gift-ready sparkle.",
        gallery: [
            "images/Braclet/Braclet.jpg",
            "images/Braclet/Braclet (2).jpg",
            "images/Braclet/Braclet (3).jpg",
            "images/Braclet/Braclet (4).jpg",
            "images/Braclet/Braclet with Charm.jpg",
            "images/Braclet/Braclet with Charm (2).jpg",
            "images/Braclet/Braclet with Charm (3).jpg",
            "images/Braclet/Braclet with Charm (4).jpg",
            "images/Braclet/Braclet with Charm (5).jpg",
            "images/Braclet/Braclet with Charm (6).jpg",
            "images/Braclet/Braclet with Charm (7).jpg",
            "images/Braclet/Braclet with Charm (8).jpg",
            "images/Braclet/Braclet with Charm (9).jpg",
            "images/Braclet/Braclet with Charm (10).jpg",
            "images/Braclet/Braclet with Charm (11).jpg",
            "images/Braclet/Braclet with Charm (12).jpg",
            "images/Braclet/Chain Braclet.jpg",
            "images/Braclet/Couple Braclet.jpg",
            "images/Braclet/Fairy Kada.jpg"
        ]
    },
    {
        value: "resin-work",
        label: "Resin Frames",
        image: "images/Resin Frame Work/Resin Frame.jpg",
        description: "Glossy keepsake frames that lock your favorite memories in color.",
        gallery: [
            "images/Resin Frame Work/Resin Frame.jpg",
            "images/Resin Frame Work/Resin Frame (2).jpg",
            "images/Resin Frame Work/Resin Frame (3).jpg",
            "images/Resin Frame Work/Resin Frame (4).jpg",
            "images/Resin Frame Work/Resin Frame(3).jpg",
            "images/Resin Frame Work/Resin Frame(4).jpg"
        ]
    },
    {
        value: "name-board-fridge-magnet",
        label: "Name Boards & Magnets",
        image: "images/Resin Frame Work/Resin Name Board.jpg",
        description: "Personalized name boards and fridge magnets with a sweet handmade finish.",
        gallery: [
            "images/Resin Frame Work/Resin Name Board.jpg"
        ]
    },
    {
        value: "keychain",
        label: "Resin Keychains",
        image: "images/Resin Keychain/Resin Transparent Keychain.jpg",
        description: "Tiny daily keepsakes with names, initials, flowers, and color pop.",
        gallery: [
            "images/Resin Keychain/Resin Dual Color Keychain.jpg",
            "images/Resin Keychain/Resin Dual Color Keychain (2).jpg",
            "images/Resin Keychain/Resin Dual Color Keychain (3).jpg",
            "images/Resin Keychain/Resin Dual Color Keychain (4).jpg",
            "images/Resin Keychain/Resin Monocolor Keychain.jpg",
            "images/Resin Keychain/Resin Transparent Keychain.jpg",
            "images/Resin Keychain/Resin Transparent Keychain (2).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (3).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (4).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (5).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (6).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (7).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (8).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (9).jpg",
            "images/Resin Keychain/Resin Tricolor Keychain.jpg",
            "images/Resin Keychain/Resin Tricolor Keychain (2).jpg"
        ]
    },
    {
        value: "hair-accessories",
        label: "Hair Accessories",
        image: "images/Accessories/Centre Clip.jpg",
        description: "Cute clips and bands that make everyday styling feel special.",
        gallery: [
            "images/Accessories/Alligator Clip.jpg",
            "images/Accessories/Centre Clip.jpg",
            "images/Accessories/Hair Band .jpg"
        ]
    },
    {
        value: "thread-work-bangle-earrings",
        label: "Bangles & Earrings",
        image: "images/Accessories/Resin Transparent Earrings.jpg",
        description: "Lightweight statement pieces made for festive looks and quick gifts.",
        gallery: [
            "images/Accessories/Neck Chain + Braclet.jpg",
            "images/Accessories/Neck Chain.jpg",
            "images/Accessories/Resin Transparent Earrings.jpg"
        ]
    },
    {
        value: "led-gifts",
        label: "LED Gifts",
        image: "images/Resin Frame Work/Resin Frame (4).jpg",
        description: "Light-up personalized keepsakes for names, dates, and photos.",
        gallery: [
            "images/Resin Frame Work/Resin Frame (4).jpg"
        ]
    },
    {
        value: "couple-gifts",
        label: "Couple Gifts",
        image: "images/Braclet/Couple Braclet.jpg",
        description: "Matching keepsakes and romantic custom gifts for two.",
        gallery: [
            "images/Braclet/Couple Braclet.jpg"
        ]
    }
];

const categoryImageMap = productCategories.reduce((map, category) => {
    map[category.value] = category.image;
    return map;
}, {});

const legacyProductImages = {
    "images/keychain.jpeg": categoryImageMap.keychain,
    "images/braclet.jpeg": categoryImageMap.bracelet,
    "images/bracelet.jpeg": categoryImageMap.bracelet
};

const legacyProductDescriptions = {
    "rose-keychain": "A glossy resin keychain that turns names, initials, or tiny memories into an everyday favorite.",
    "bracelet-gift": "A handmade bracelet with a neat finish, ready to make birthdays and friendship days feel personal.",
    "name-keychain": "A custom name keychain with clean lettering, bright resin, and a keepsake feel.",
    "custom-bracelet": "A made-for-you bracelet with colors, charms, and details that match the person wearing it."
};

const categoryDefaultPrices = {
    bracelet: 199,
    "resin-work": 499,
    "name-board-fridge-magnet": 599,
    keychain: 149,
    "hair-accessories": 129,
    "thread-work-bangle-earrings": 159,
    "led-gifts": 999,
    "couple-gifts": 299
};

const categoryOccasions = {
    bracelet: ["birthday", "anniversary", "friendship-day", "valentines-day"],
    "resin-work": ["birthday", "anniversary", "valentines-day"],
    "name-board-fridge-magnet": ["birthday", "anniversary"],
    keychain: ["birthday", "friendship-day", "valentines-day"],
    "hair-accessories": ["birthday", "friendship-day"],
    "thread-work-bangle-earrings": ["birthday", "friendship-day", "valentines-day"],
    "led-gifts": ["birthday", "anniversary", "valentines-day"],
    "couple-gifts": ["anniversary", "valentines-day"]
};

function nameFromImagePath(image) {
    return String(image || "")
        .split("/")
        .pop()
        .replace(/\.[^.]+$/, "")
        .replace(/\s+/g, " ")
        .trim();
}

function slugFromText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function productsFromCategoryImages() {
    return productCategories.flatMap(category => {
        const images = category.gallery || [category.image];

        return images.map((image, index) => {
            const name = nameFromImagePath(image);

            return {
                id: `${category.value}-${slugFromText(name)}-${index + 1}`,
                name,
                price: categoryDefaultPrices[category.value] || 149,
                image,
                images: [image],
                type: category.value,
                category: category.label,
                description: `${category.description} Choose the ${name} design and personalize it your way.`,
                stock: 20,
                rating: Number((4.6 + (index % 4) / 10).toFixed(1)),
                featured: index === 0,
                occasions: categoryOccasions[category.value] || ["birthday"]
            };
        });
    });
}

const defaultProducts = productsFromCategoryImages();

function normalizeShopProduct(product = {}) {
    const type = productTypeValue(product);
    const images = productImages({
        ...product,
        type
    });
    const hasStock = product.stock !== undefined && product.stock !== null && product.stock !== "";
    const stock = Number(product.stock);
    const rating = Number(product.rating);

    return {
        ...product,
        id: productIdValue(product) || makeProductId(product.name || "product"),
        image: images[0],
        images,
        type,
        category: product.category || productCategoryLabel(type),
        description: productDescription({ ...product, type }),
        stock: hasStock && Number.isFinite(stock) ? Math.max(Math.floor(stock), 0) : 20,
        rating: Number.isFinite(rating) ? Math.min(Math.max(rating, 0), 5) : 0
    };
}

function productCategoryData(value) {
    return productCategories.find(item => item.value === value);
}

function productCategoryLabel(value) {
    const category = productCategoryData(value);
    return category ? category.label : value || "Product";
}

function productCategoryDescription(value) {
    return productCategoryData(value)?.description || "Handmade keepsakes designed for personal gifting.";
}

function productCategoryImage(value) {
    return productCategoryData(value)?.image || "images/Logo.png";
}

function productIdValue(product) {
    return String(product?.id || product?._id || "").trim();
}

function productCategoryDisplay(product) {
    return String(product?.category || productCategoryLabel(productTypeValue(product))).trim();
}

function productTypeValue(product) {
    const type = product?.type || "";

    if (productCategories.some(category => category.value === type)) {
        return type;
    }

    const name = [product?.name, product?.category].join(" ").toLowerCase();

    if (name.includes("bracelet")) return "bracelet";
    if (name.includes("frame") || name.includes("resin")) return "resin-work";
    if (name.includes("magnet") || name.includes("name board")) return "name-board-fridge-magnet";
    if (name.includes("led")) return "led-gifts";
    if (name.includes("couple")) return "couple-gifts";
    if (name.includes("hair")) return "hair-accessories";
    if (name.includes("bangle") || name.includes("earring")) return "thread-work-bangle-earrings";

    return "keychain";
}

function productFestivalValues(product) {
    const explicit = Array.isArray(product?.occasions)
        ? product.occasions.map(item => String(item || "").trim()).filter(Boolean)
        : [];
    const inferred = Object.keys(festivalCollections).filter(key => productMatchesFestival(product, key));

    return Array.from(new Set([...explicit, ...inferred]));
}

function productMatchesFestival(product, festivalKey) {
    const collection = festivalCollections[festivalKey];
    if (!collection) return true;

    const explicit = Array.isArray(product?.occasions)
        ? product.occasions.map(item => String(item || "").trim())
        : [];

    if (explicit.includes(festivalKey)) return true;

    const type = productTypeValue(product);
    const haystack = [
        product?.name,
        product?.description,
        productCategoryLabel(type)
    ].join(" ").toLowerCase();
    const hasKeyword = collection.keywords.some(keyword => haystack.includes(keyword));

    return hasKeyword || collection.types.includes(type);
}

function normalizeProductImage(image, type) {
    const cleanImage = String(image || "").trim();
    const legacyImage = legacyProductImages[cleanImage.toLowerCase()];

    if (legacyImage) {
        return legacyImage;
    }

    return cleanImage || productCategoryImage(type);
}

function productImages(product) {
    const type = productTypeValue(product);
    const rawImages = [
        product?.image,
        ...(Array.isArray(product?.images) ? product.images : [])
    ];
    const images = [];

    rawImages.forEach(image => {
        image = normalizeProductImage(image, type);

        if (image && !images.includes(image) && images.length < 10) {
            images.push(image);
        }
    });

    return images.length ? images : [productCategoryImage(type)];
}

function productDescription(product) {
    const id = String(product?.id || "").trim();
    const description = String(product?.description || "").trim();

    return legacyProductDescriptions[id] || description || productCategoryDescription(productTypeValue(product));
}

function productStock(product) {
    const stock = Number(product?.stock);
    return Number.isFinite(stock) ? Math.max(Math.floor(stock), 0) : 0;
}

function productStockStatus(product) {
    const stock = productStock(product);

    if (stock <= 0) {
        return { label: "Out of Stock", className: "out" };
    }

    if (stock <= 2) {
        return { label: `Only ${stock} Left`, className: "low" };
    }

    return { label: "In Stock", className: "" };
}

function productRating(product) {
    const explicitRating = Number(product?.rating);

    if (Number.isFinite(explicitRating) && explicitRating > 0) {
        return explicitRating.toFixed(1);
    }

    const seed = String(product?.id || product?.name || "gift")
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return (4.6 + (seed % 4) / 10).toFixed(1);
}

function renderProductSkeletons(container, count = 4) {
    if (!container) return;

    container.innerHTML = Array.from({ length: count }, () => `
        <div class="card product-card skeleton-card" aria-hidden="true">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-line wide"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line short"></div>
        </div>
    `).join("");
}

function renderCategoryTiles() {
    const containers = document.querySelectorAll("[data-category-tiles]");
    if (!containers.length) return;

    containers.forEach(container => {
        const isHome = container.getAttribute("data-category-tiles") === "home";
        const categories = isHome
            ? [
                productCategoryData("keychain"),
                productCategoryData("resin-work"),
                productCategoryData("bracelet"),
                {
                    value: "birthday",
                    label: "Birthday Gifts",
                    image: "images/Resin Keychain/Resin Dual Color Keychain.jpg",
                    description: "Names, colors, and tiny keepsakes made for birthday surprises.",
                    festival: true
                },
                {
                    value: "valentines-day",
                    label: "Couple Gifts",
                    image: "images/Braclet/Couple Braclet.jpg",
                    description: "Matching bracelets and romantic keepsakes for two.",
                    festival: true
                }
            ].filter(Boolean)
            : productCategories;

        container.innerHTML = categories.map(category => `
            <button type="button" class="category-card" onclick="${category.festival ? `filterFestival('${quote(category.value)}')` : `filterEmotion('${quote(category.value)}')`}">
                <img src="${category.image}" alt="${escapeHtml(category.label)}" loading="lazy">
                <span>${escapeHtml(category.label)}</span>
                <small>${escapeHtml(category.description)}</small>
            </button>
        `).join("");
    });
}

function getProducts() {
    const savedProducts = localStorage.getItem("products");
    if (!savedProducts) return defaultProducts;

    try {
        const products = JSON.parse(savedProducts);
        return Array.isArray(products) ? products.map(normalizeShopProduct) : defaultProducts;
    } catch (error) {
        localStorage.removeItem("products");
        return defaultProducts;
    }
}

async function getProductsData() {
    if (useBackend) {
        try {
            const data = await phpProductRequest("products.php");
            saveProducts(data.products);
            return data.products;
        } catch (error) {
            console.warn(error.message);
        }

        try {
            const data = await apiRequest("/api/products");
            saveProducts(data.products);
            return data.products;
        } catch (error) {
            console.warn(error.message);
        }
    }

    return getProducts();
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify((Array.isArray(products) ? products : []).map(normalizeShopProduct)));
}

async function phpJsonRequest(path, options = {}, fallbackError = "Request failed") {
    const headers = { ...(options.headers || {}) };

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(path, { ...options, headers, credentials: "same-origin" });
    const contentType = (response.headers.get("Content-Type") || "").toLowerCase();
    const isJson = contentType.includes("application/json");

    if (!isJson) {
        throw new Error("Request failed");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
        const isHtml404 = response.status === 404 && contentType.includes("text/html");
        throw new Error(isHtml404 ? "Request failed" : data.error || fallbackError);
    }

    if (data.success !== true) {
        throw new Error(fallbackError);
    }

    return data;
}

async function phpProductRequest(path, options = {}) {
    const data = await phpJsonRequest(path, options, "Product request failed");

    if (!Array.isArray(data.products) && !data.product) {
        throw new Error("Product request failed");
    }

    return data;
}

async function phpOrderRequest(path, options = {}) {
    const data = await phpJsonRequest(path, options, "Order request failed");

    if (!Array.isArray(data.orders) && !data.order) {
        throw new Error("Order request failed");
    }

    return data;
}

async function phpContactRequest(path, options = {}) {
    const data = await phpJsonRequest(path, options, "Contact request failed");

    if (!data.contact) {
        throw new Error("Contact request failed");
    }

    return data;
}

async function phpNotificationsRequest(path, options = {}) {
    const data = await phpJsonRequest(path, options, "Notification request failed");

    if (!Array.isArray(data.notifications) && !data.notification) {
        throw new Error("Notification request failed");
    }

    return data;
}

async function phpUsersRequest(path, options = {}) {
    const data = await phpJsonRequest(path, options, "User request failed");

    if (!Array.isArray(data.users)) {
        throw new Error("User request failed");
    }

    return data;
}

async function phpStatsRequest(path, options = {}) {
    return phpJsonRequest(path, options, "Stats request failed");
}

async function apiFormDataRequest(path, formData, options = {}) {
    const headers = { ...(options.headers || {}) };
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const apiBaseUrl = window.SMARTORNAMENTS_API_URL || localStorage.getItem("apiBaseUrl") || "";
    const url = /^https?:\/\//i.test(path) ? path : apiBaseUrl + path;

    if (token) headers.Authorization = "Bearer " + token;

    const response = await fetch(url, { ...options, method: options.method || "POST", headers, body: formData });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.error || "Upload failed");
    }

    return data;
}

function makeProductId(name) {
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
}

function findProduct(id) {
    return getProducts().find(product => productIdValue(product) === id);
}

async function findProductData(id) {
    const products = await getProductsData();
    return products.map(normalizeShopProduct).find(product => productIdValue(product) === id);
}

function quote(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function productCard(product, options = {}) {
    product = normalizeShopProduct(product);
    const images = productImages(product);
    const photoCount = images.length;
    const typeValue = productTypeValue(product);
    const description = productDescription(product);
    const festivals = productFestivalValues(product).join(" ");
    const displayName = escapeHtml(product.name || "Product");
    const productId = productIdValue(product);
    const categoryLabel = escapeHtml(productCategoryDisplay(product));
    const descriptionText = escapeHtml(description);
    const price = Number(product.price || 0);
    const rating = productRating(product);
    const stock = productStock(product);
    const stockStatus = productStockStatus(product);
    const stockClass = stockStatus.className ? " " + stockStatus.className : "";
    const detailsButton = options.admin
        ? ""
        : `<button type="button" class="secondary-card-btn" onclick="openProduct('${quote(productId)}')">Customize</button>`;
    const addCartButton = options.hideCart
        ? ""
        : `<button type="button" class="primary-card-btn" ${stock <= 0 ? "disabled" : ""} onclick="addProductToCart('${quote(productId)}')">${stock <= 0 ? "Out of Stock" : "Add to Cart"}</button>`;
    const adminButtons = options.admin
        ? `
            <button type="button" onclick="editAdminProduct('${quote(productId)}')">Edit</button>
            <button type="button" onclick="deleteAdminProduct('${quote(productId)}')">Delete</button>
        `
        : "";

    return `
        <article class="card product-card" data-type="${typeValue}" data-category="${escapeHtml(productCategoryDisplay(product).toLowerCase())}" data-festivals="${festivals}">
            <button type="button" class="product-image-button" onclick="openProduct('${quote(productId)}')" aria-label="View ${displayName}">
                <img src="${images[0]}" alt="${displayName}" loading="lazy">
            </button>
            <div class="product-card-body">
                <div class="product-meta-row">
                    <small class="product-category">${categoryLabel}</small>
                    <span class="product-rating" aria-label="${rating} out of 5 rating">${rating}</span>
                </div>
                <h3>
                    <button type="button" class="product-title-button" onclick="openProduct('${quote(productId)}')">${displayName}</button>
                </h3>
                <p class="product-card-price">${money(price)}</p>
                <small class="stock-pill${stockClass}">${stockStatus.label}</small>
                <small class="photo-count">${photoCount} ${photoCount === 1 ? "photo" : "photos"}</small>
                <small class="product-description">${descriptionText}</small>
            </div>
            <div class="product-card-actions">
                ${detailsButton}
                ${addCartButton}
                ${adminButtons}
            </div>
        </article>
    `;
}

async function renderFeaturedProducts() {
    const container = document.getElementById("featuredProducts");
    if (!container) return;

    renderProductSkeletons(container, 3);
    const products = (await getProductsData()).filter(product => product.featured).slice(0, 4);
    container.innerHTML = products.length
        ? products.map(product => productCard(product)).join("")
        : `<div class="empty-panel">No featured products yet.</div>`;
}

async function renderTrendingProducts() {
    const container = document.getElementById("trendingProducts");
    if (!container) return;

    renderProductSkeletons(container, 4);
    const products = (await getProductsData()).filter(product => !product.featured).slice(0, 4);
    container.innerHTML = products.length
        ? products.map(product => productCard(product)).join("")
        : `<div class="empty-panel">Trending products will appear soon.</div>`;
}

function getBestSellerFromOrders(orders, products = getProducts()) {
    const totals = new Map();

    (orders || []).forEach(order => {
        (order.items || []).forEach(item => {
            const name = String(item.name || "").trim();
            if (!name) return;

            const key = name.toLowerCase();
            const qty = Number(item.qty || 1);
            const current = totals.get(key) || { name, quantity: 0 };
            current.quantity += qty;
            totals.set(key, current);
        });
    });

    const best = Array.from(totals.values()).sort((a, b) => b.quantity - a.quantity)[0];
    if (!best) return null;

    const product = products.find(item => String(item.name || "").toLowerCase() === best.name.toLowerCase());
    return { ...best, product };
}

async function getBestSellerData() {
    if (useBackend) {
        try {
            const data = await phpStatsRequest("stats.php?scope=public");
            if (data.bestSeller) return data.bestSeller;
        } catch (error) {
            console.warn(error.message);
        }

        try {
            const data = await apiRequest("/api/stats?scope=public");
            if (data.bestSeller) return data.bestSeller;
        } catch (error) {
            console.warn(error.message);
        }
    }

    const products = await getProductsData();
    return getBestSellerFromOrders(getLocalOrders(), products);
}

async function renderBestSellerSection() {
    const container = document.getElementById("bestSellerProduct");
    if (!container) return;

    const bestSeller = await getBestSellerData();

    if (!bestSeller) {
        container.innerHTML = "<p>Most ordered product will appear after the first order.</p>";
        return;
    }

    const product = bestSeller.product || {};
    const image = productImages(product)[0];
    const price = Number(product.price || 0);
    const productName = product.name || bestSeller.name;

    container.innerHTML = `
        <div class="best-seller-card">
            <img src="${image}" alt="${escapeHtml(productName)}">
            <div>
                <span class="eyebrow">Most ordered product</span>
                <h3>${escapeHtml(productName)}</h3>
                <p>${Number(bestSeller.quantity || 0)} orders placed for this product.</p>
                ${price ? `<p><b>${money(price)}</b></p>` : ""}
                <button onclick="${productIdValue(product) ? `openProduct('${quote(productIdValue(product))}')` : `filterEmotion('keychain')`}">Customize</button>
            </div>
        </div>
    `;
}

async function renderProducts() {
    const container = document.getElementById("productList");
    if (!container) return;

    renderProductSkeletons(container, 8);
    const products = await getProductsData();
    container.innerHTML = products.length
        ? products.map(product => productCard(product)).join("")
        : `<div class="empty-panel">No products available yet.</div>`;
    initProductSearchFromQuery();
}

async function loadAdminProducts() {
    const container = document.getElementById("adminProducts");
    if (!container) return;

    const products = await getProductsData();
    const totalProducts = document.getElementById("totalProducts");

    if (totalProducts) totalProducts.innerText = products.length;
    updateInventoryStats(products);

    container.innerHTML = products.length
        ? products.map(product => productCard(product, { admin: true, hideCart: true })).join("")
        : "<p>No products found.</p>";
}

function updateInventoryStats(products) {
    const lowStock = products.filter(product => {
        const stock = productStock(product);
        return stock > 0 && stock <= 2;
    }).length;
    const outOfStock = products.filter(product => productStock(product) <= 0).length;
    const inventoryCount = document.getElementById("inventoryCount");
    const lowStockCount = document.getElementById("lowStockCount");
    const onlyFewLeftCount = document.getElementById("onlyFewLeftCount");
    const outOfStockCount = document.getElementById("outOfStockCount");
    const outOfStockCountInline = document.getElementById("outOfStockCountInline");

    if (inventoryCount) inventoryCount.innerText = products.length;
    if (lowStockCount) lowStockCount.innerText = lowStock;
    if (onlyFewLeftCount) onlyFewLeftCount.innerText = lowStock;
    if (outOfStockCount) outOfStockCount.innerText = outOfStock;
    if (outOfStockCountInline) outOfStockCountInline.innerText = outOfStock;
}

function getAdminImageValues() {
    const images = [];

    document.querySelectorAll(".admin-image-field").forEach(field => {
        const image = field.value.trim();

        if (image && !images.includes(image) && images.length < 10) {
            images.push(image);
        }
    });

    return images;
}

function setFirstEmptyAdminImage(value) {
    const fields = Array.from(document.querySelectorAll(".admin-image-field"));
    const target = fields.find(field => !field.value.trim()) || fields[0];

    if (target) {
        target.value = value;
    }
}

async function uploadAdminProductImage(input) {
    const file = input.files?.[0];
    const msg = document.getElementById("imageUploadMsg");

    if (!file) return;

    if (msg) msg.innerText = "Uploading image...";

    if (useBackend) {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const data = await apiFormDataRequest("/api/products/upload", formData);
            setFirstEmptyAdminImage(data.image);
            if (msg) msg.innerText = "Image uploaded to Cloudinary.";
            return;
        } catch (error) {
            if (!isApiUnavailableError(error) && !/cloudinary/i.test(error.message)) {
                if (msg) msg.innerText = error.message;
                return;
            }

            console.warn(error.message);
        }
    }

    const localImage = await resizeOrderPhoto(file);
    if (localImage?.dataUrl) {
        setFirstEmptyAdminImage(localImage.dataUrl);
        if (msg) msg.innerText = "Image attached locally. Add Cloudinary keys for CDN uploads.";
    }
}

function getProductFormData() {
    const id = document.getElementById("productId").value;
    const name = document.getElementById("adminProductName").value.trim();
    const price = Number(document.getElementById("adminProductPrice").value);
    const images = getAdminImageValues();
    const image = images[0] || "";
    const type = document.getElementById("adminProductType").value;
    const typeOption = document.getElementById("adminProductType").selectedOptions[0];
    const category = typeOption ? typeOption.textContent.trim() : productCategoryLabel(type);
    const description = document.getElementById("adminProductDescription").value.trim();
    const stock = Number(document.getElementById("adminProductStock")?.value || 0);
    const rating = Number(document.getElementById("adminProductRating")?.value || 0);
    const featured = document.getElementById("adminProductFeatured").checked;

    if (!name || !price || !image) {
        return null;
    }

    return {
        id: id || "",
        name,
        price,
        image,
        images,
        type,
        category,
        description,
        stock: Math.max(Math.floor(stock), 0),
        rating: Math.min(Math.max(rating, 0), 5),
        featured
    };
}

async function saveAdminProduct() {
    const product = getProductFormData();
    const msg = document.getElementById("productAdminMsg");
    const isEditing = Boolean(product?.id);

    if (!product) {
        msg.innerText = "Enter product name, price, and image path.";
        return;
    }

    if (useBackend) {
        try {
            const method = isEditing ? "PUT" : "POST";
            const path = isEditing ? "products.php?id=" + encodeURIComponent(product.id) : "products.php";
            await phpProductRequest(path, {
                method,
                body: JSON.stringify(product)
            });
            resetProductForm();
            await loadAdminProducts();
            await loadAdminNotifications();
            msg.innerText = "Product saved in products table.";
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                msg.innerText = error.message;
                return;
            }

            console.warn(error.message);
        }

        try {
            const method = isEditing ? "PUT" : "POST";
            const path = isEditing ? "/api/products/" + encodeURIComponent(product.id) : "/api/products";
            await apiRequest(path, {
                method,
                body: JSON.stringify(product)
            });
            resetProductForm();
            await loadAdminProducts();
            await loadAdminNotifications();
            msg.innerText = "Product saved.";
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                msg.innerText = error.message;
                return;
            }

            console.warn(error.message);
        }
    }

    const products = getProducts();
    const existingIndex = products.findIndex(item => productIdValue(item) === product.id);
    if (existingIndex >= 0) products[existingIndex] = product;
    else {
        product.id = makeProductId(product.name);
        products.push(product);
    }
    addLocalNotification(
        "product",
        isEditing ? "Product updated" : "Product added",
        `${product.name} was ${isEditing ? "updated" : "added to the shop"}`,
        { productId: product.id }
    );
    resetProductForm();
    saveProducts(products);
    loadAdminProducts();
    loadAdminNotifications();
    msg.innerText = "Product saved.";
}

async function editAdminProduct(id) {
    const product = await findProductData(id);
    if (!product) return;

    resetProductForm();
    document.getElementById("productId").value = productIdValue(product);
    document.getElementById("adminProductName").value = product.name;
    document.getElementById("adminProductPrice").value = product.price;
    productImages(product).forEach((image, index) => {
        const field = document.getElementById("adminProductImage" + (index + 1));
        if (field) field.value = image;
    });
    document.getElementById("adminProductType").value = productTypeValue(product);
    document.getElementById("adminProductDescription").value = product.description || "";
    const stockField = document.getElementById("adminProductStock");
    const ratingField = document.getElementById("adminProductRating");
    if (stockField) stockField.value = productStock(product);
    if (ratingField) ratingField.value = productRating(product);
    document.getElementById("adminProductFeatured").checked = Boolean(product.featured);
    document.getElementById("productAdminMsg").innerText = "Editing " + product.name;
}

async function deleteAdminProduct(id) {
    if (useBackend) {
        try {
            await phpProductRequest("products.php?id=" + encodeURIComponent(id), { method: "DELETE" });
            await loadAdminProducts();
            await loadAdminNotifications();
            resetProductForm();
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                document.getElementById("productAdminMsg").innerText = error.message;
                return;
            }

            console.warn(error.message);
        }

        try {
            await apiRequest("/api/products/" + encodeURIComponent(id), { method: "DELETE" });
            await loadAdminProducts();
            await loadAdminNotifications();
            resetProductForm();
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                document.getElementById("productAdminMsg").innerText = error.message;
                return;
            }

            console.warn(error.message);
        }
    }

    const existingProduct = getProducts().find(product => productIdValue(product) === id);
    const products = getProducts().filter(product => productIdValue(product) !== id);
    saveProducts(products);
    addLocalNotification(
        "product",
        "Product deleted",
        `${existingProduct?.name || "A product"} was removed from the shop`,
        { productId: id }
    );
    loadAdminProducts();
    loadAdminNotifications();
    resetProductForm();
}

function resetProductForm() {
    const formIds = [
        "productId",
        "adminProductName",
        "adminProductPrice",
        "adminProductDescription",
        "adminProductUpload"
    ];

    formIds.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = "";
    });

    const type = document.getElementById("adminProductType");
    const stock = document.getElementById("adminProductStock");
    const rating = document.getElementById("adminProductRating");
    const featured = document.getElementById("adminProductFeatured");
    const msg = document.getElementById("productAdminMsg");
    const uploadMsg = document.getElementById("imageUploadMsg");

    document.querySelectorAll(".admin-image-field").forEach(field => {
        field.value = "";
    });

    if (type) type.value = "bracelet";
    if (stock) stock.value = "20";
    if (rating) rating.value = "4.8";
    if (featured) featured.checked = false;
    if (msg) msg.innerText = "";
    if (uploadMsg) uploadMsg.innerText = "";
}

async function getUsersData() {
    if (useBackend) {
        try {
            const data = await phpUsersRequest("users.php");
            return data.users;
        } catch (error) {
            console.warn(error.message);
        }

        try {
            const data = await apiRequest("/api/users");
            return data.users;
        } catch (error) {
            console.warn(error.message);
        }
    }

    return getLocalUsers().map((user, index) => ({
        id: index + 1,
        name: user.username,
        email: user.username,
        role: user.role || "customer",
        createdAt: "Local browser record"
    }));
}

async function loadAdminUsers() {
    const container = document.getElementById("adminUsers");
    if (!container) return;

    const users = await getUsersData();
    const customers = users.filter(user => (user.role || "customer") !== "admin");
    const totalCustomers = document.getElementById("totalCustomers");

    if (totalCustomers) totalCustomers.innerText = users.length;

    if (customers.length === 0) {
        container.innerHTML = "<p>No customer records yet.</p>";
        return;
    }

    container.innerHTML = customers.map(user => `
        <div class="record-card">
            <h3>${escapeHtml(user.name || "Customer")}</h3>
            <p><b>Email:</b> ${escapeHtml(user.email || "Not provided")}</p>
            <p><b>Role:</b> ${escapeHtml(user.role || "customer")}</p>
            <small>${escapeHtml(user.createdAt || "")}</small>
        </div>
    `).join("");
}

function getLocalNotifications() {
    try {
        const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        return Array.isArray(notifications) ? notifications : [];
    } catch (error) {
        localStorage.removeItem("notifications");
        return [];
    }
}

function saveLocalNotifications(notifications) {
    localStorage.setItem("notifications", JSON.stringify(notifications.slice(0, 100)));
}

function addLocalNotification(type, title, message, meta = {}) {
    const notifications = getLocalNotifications();
    notifications.unshift({
        id: "local-" + Date.now() + "-" + Math.random().toString(16).slice(2),
        type,
        title,
        message,
        meta,
        read: false,
        createdAt: new Date().toLocaleString()
    });
    saveLocalNotifications(notifications);
}

async function getNotificationsData() {
    if (useBackend) {
        try {
            const data = await phpNotificationsRequest("notifications.php");
            return data.notifications;
        } catch (error) {
            console.warn(error.message);
        }

        try {
            const data = await apiRequest("/api/notifications");
            return data.notifications;
        } catch (error) {
            console.warn(error.message);
        }
    }

    return getLocalNotifications();
}

function notificationTime(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

async function loadAdminNotifications() {
    const container = document.getElementById("adminNotifications");
    if (!container) return;

    const notifications = await getNotificationsData();
    const unread = notifications.filter(item => !item.read).length;
    const totalNotifications = document.getElementById("totalNotifications");

    if (totalNotifications) totalNotifications.innerText = unread;

    if (notifications.length === 0) {
        container.innerHTML = "<p>No notifications yet.</p>";
        return;
    }

    container.innerHTML = notifications.map(notification => {
        const id = quote(notification.id);
        const readClass = notification.read ? "" : " unread";
        const readButton = notification.read
            ? ""
            : `<button onclick="markNotificationRead('${id}')">Mark Read</button>`;

        return `
            <div class="notification-card${readClass}">
                <div>
                    <small>${escapeHtml(notification.type || "notification")}</small>
                    <h3>${escapeHtml(notification.title || "Notification")}</h3>
                    <p>${escapeHtml(notification.message || "")}</p>
                    <span>${escapeHtml(notificationTime(notification.createdAt))}</span>
                </div>
                <div class="notification-actions">
                    ${readButton}
                </div>
            </div>
        `;
    }).join("");
}

async function markNotificationRead(id) {
    if (useBackend) {
        try {
            await phpNotificationsRequest("notifications.php?id=" + encodeURIComponent(id), {
                method: "PATCH",
                body: JSON.stringify({ read: true })
            });
            await loadAdminNotifications();
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                alert(error.message);
                return;
            }

            console.warn(error.message);
        }

        try {
            await apiRequest("/api/notifications/" + encodeURIComponent(id), {
                method: "PATCH",
                body: JSON.stringify({ read: true })
            });
            await loadAdminNotifications();
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                alert(error.message);
                return;
            }

            console.warn(error.message);
        }
    }

    const notifications = getLocalNotifications().map(notification =>
        String(notification.id) === String(id) ? { ...notification, read: true } : notification
    );
    saveLocalNotifications(notifications);
    loadAdminNotifications();
}

function initContactPage() {
    showUser();
    updateCartCount();

    const emailField = document.getElementById("contactEmail");
    const nameField = document.getElementById("contactName");
    const user = localStorage.getItem("loggedInUser") || "";

    if (user && user.includes("@") && emailField && !emailField.value) {
        emailField.value = user;
    }

    if (user && nameField && !nameField.value) {
        nameField.value = user.includes("@") ? user.split("@")[0] : user;
    }
}

function getContactFormData() {
    return {
        name: getFieldValue("contactName"),
        email: getFieldValue("contactEmail"),
        phone: getFieldValue("contactPhone"),
        subject: getFieldValue("contactSubject") || "Contact form",
        message: getFieldValue("contactMessage")
    };
}

function validateContactForm(data) {
    if (!data.name || !data.message || (!data.email && !data.phone)) {
        return "Name, message, and email or phone are required.";
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return "Enter a valid email address.";
    }

    return "";
}

function contactMailtoUrl(data) {
    const body = [
        "New SmartOrnaments contact message",
        "",
        `Name: ${data.name}`,
        `Email: ${data.email || "Not provided"}`,
        `Phone: ${data.phone || "Not provided"}`,
        `Subject: ${data.subject}`,
        "",
        data.message
    ].join("\n");

    return `mailto:${ownerEmail}?subject=${encodeURIComponent("SmartOrnaments contact: " + data.subject)}&body=${encodeURIComponent(body)}`;
}

async function submitContactForm(event) {
    event.preventDefault();

    const msg = document.getElementById("contactMsg");
    const form = document.getElementById("contactForm");
    const data = getContactFormData();
    const validationError = validateContactForm(data);

    if (validationError) {
        if (msg) msg.innerText = validationError;
        return false;
    }

    if (msg) msg.innerText = "Sending message...";

    if (useBackend) {
        try {
            await phpContactRequest("contact.php", {
                method: "POST",
                body: JSON.stringify(data)
            });
            if (form) form.reset();
            if (msg) msg.innerText = "Message sent. SmartOrnaments received your contact request.";
            return true;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                if (msg) msg.innerText = error.message;
                return false;
            }

            console.warn(error.message);
        }

        try {
            await apiRequest("/api/contact", {
                method: "POST",
                body: JSON.stringify(data)
            });
            if (form) form.reset();
            if (msg) msg.innerText = "Message sent. SmartOrnaments received your contact request.";
            return true;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                if (msg) msg.innerText = error.message;
                return false;
            }

            console.warn(error.message);
        }
    }

    addLocalNotification("contact", "New contact message", `${data.name} sent a message: ${data.subject}`);
    window.open(contactMailtoUrl(data), "_blank");
    if (form) form.reset();
    if (msg) msg.innerText = "Email app opened for smartornaments.shop@gmail.com.";
    return true;
}

function buildWhatsAppOrderUrl(product, price, details = {}) {
    const message = buildDirectOrderMessage(product, price, details);
    return `https://wa.me/916374118664?text=${encodeURIComponent(message)}`;
}

function savePendingDirectOrder(product, price, details = {}) {
    sessionStorage.setItem("pendingDirectOrder", JSON.stringify({ product, price, details }));
}

function takePendingDirectOrder() {
    const savedOrder = sessionStorage.getItem("pendingDirectOrder");
    sessionStorage.removeItem("pendingDirectOrder");

    if (!savedOrder) return null;

    try {
        return JSON.parse(savedOrder);
    } catch (error) {
        return null;
    }
}

function openDirectOrder(product, price, details = {}, sameWindow = false) {
    const url = buildWhatsAppOrderUrl(product, price, details);

    if (sameWindow) {
        window.location.href = url;
        return;
    }

    window.open(url, "_blank");
}

function resizeOrderPhoto(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const maxSize = 900;
                const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(image.width * scale));
                canvas.height = Math.max(1, Math.round(image.height * scale));
                const context = canvas.getContext("2d");

                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve({
                    name: file.name,
                    dataUrl: canvas.toDataURL("image/jpeg", 0.72)
                });
            };

            image.onerror = reject;
            image.src = reader.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function renderPhotoPreview(targetId, photo) {
    const preview = document.getElementById(targetId);
    if (!preview) return;

    if (!photo?.dataUrl) {
        preview.innerHTML = "";
        return;
    }

    preview.innerHTML = `
        <img src="${photo.dataUrl}" alt="${escapeHtml(photo.name || "Uploaded photo")}">
        <small>${escapeHtml(photo.name || "Photo selected")}</small>
    `;
}

async function handleCustomizationPhoto(input) {
    const file = input.files?.[0];
    orderPhotoStorage.product = await resizeOrderPhoto(file);
    renderPhotoPreview("customPhotoPreview", orderPhotoStorage.product);
}

async function handleCheckoutPhoto(input) {
    const file = input.files?.[0];
    orderPhotoStorage.checkout = await resizeOrderPhoto(file);
    renderPhotoPreview("checkoutPhotoPreview", orderPhotoStorage.checkout);
    updateOrderSummary();
}

function cleanCustomizationData(data = {}) {
    const photoData = data.photoData || data.photo?.dataUrl || "";
    const photoName = data.photoName || data.photo?.name || "";
    return {
        customName: String(data.customName || data.name || "").trim(),
        color: String(data.color || "").trim(),
        photoName: String(photoName || "").trim(),
        photoData: String(photoData || "").trim()
    };
}

function hasCustomizationData(customization) {
    const details = cleanCustomizationData(customization);
    return Boolean(details.customName || details.color || details.photoName || details.photoData);
}

function customizationKey(customization) {
    const details = cleanCustomizationData(customization);
    return JSON.stringify(details);
}

function customizationDetailsHtml(customization) {
    const details = cleanCustomizationData(customization);
    if (!hasCustomizationData(details)) return "";

    return `
        <div class="customization-details">
            ${details.customName ? `<p><b>Name:</b> ${escapeHtml(details.customName)}</p>` : ""}
            ${details.color ? `<p><b>Color:</b> ${escapeHtml(details.color)}</p>` : ""}
            ${details.photoName ? `<p><b>Photo:</b> ${escapeHtml(details.photoName)}</p>` : ""}
            ${details.photoData ? `<img src="${details.photoData}" alt="${escapeHtml(details.photoName || "Customization photo")}">` : ""}
        </div>
    `;
}

function collectProductCustomization() {
    return cleanCustomizationData({
        customName: getFieldValue("customName"),
        color: getFieldValue("customColor"),
        photo: orderPhotoStorage.product
    });
}

function getCartQuantityForProduct(product) {
    const productId = productIdValue(product);
    const name = String(product?.name || "").toLowerCase();

    return getLocalCart().reduce((sum, item) => {
        const sameId = productId && String(item.productId || item.id || "") === productId;
        const sameName = !productId && String(item.name || "").toLowerCase() === name;
        return sameId || sameName ? sum + Number(item.qty || 1) : sum;
    }, 0);
}

function canAddProductToCart(product, qty) {
    const stock = productStock(product);

    if (stock <= 0) {
        alert("This product is out of stock.");
        return false;
    }

    if (getCartQuantityForProduct(product) + qty > stock) {
        alert(`Only ${stock} available for ${product.name}.`);
        return false;
    }

    return true;
}

function addCartItem(name, price, qty = 1, customization = {}, product = {}) {
    const cart = getLocalCart();
    const cleanCustomization = cleanCustomizationData(customization);
    const productId = productIdValue(product);
    const existingItem = cart.find(item =>
        String(item.productId || "") === productId
        && item.name === name
        && Number(item.price) === Number(price)
        && customizationKey(item.customization) === customizationKey(cleanCustomization)
    );

    if (existingItem) {
        existingItem.qty = Number(existingItem.qty || 1) + qty;
    } else {
        cart.push({
            productId,
            name,
            price: Number(price),
            qty,
            image: product.image || "",
            category: productCategoryDisplay(product),
            customization: cleanCustomization
        });
    }

    saveLocalCart(cart);
}

async function addProductToCart(id, qty = 1, customization = {}) {
    const product = await findProductData(id);

    if (!product) {
        alert("Product not found");
        return false;
    }

    const quantity = Math.max(Number(qty || 1), 1);

    if (!canAddProductToCart(product, quantity)) {
        return false;
    }

    addCartItem(product.name, product.price, quantity, customization, product);
    alert("Added to cart");
    return true;
}

function orderNow(product, price) {
    addCartItem(product, price);

    if (!localStorage.getItem("loggedInUser")) {
        sessionStorage.removeItem("pendingDirectOrder");
        requireLogin("cart.html");
        return;
    }

    window.location.href = "cart.html";
}

function searchProduct() {
    const searchEl = document.getElementById("search");
    const input = (searchEl?.value || "").toLowerCase();
    const cards = document.getElementsByClassName("card");
    const filters = getActiveProductFilters();
    let visibleCount = 0;

    for (let i = 0; i < cards.length; i++) {
        const title = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        const category = cards[i].querySelector(".product-category")?.innerText.toLowerCase() || "";
        const description = cards[i].querySelector(".product-description")?.innerText.toLowerCase() || "";
        const stock = cards[i].querySelector(".stock-pill")?.innerText.toLowerCase() || "";
        const itemType = cards[i].getAttribute("data-type");
        const itemFestivals = (cards[i].getAttribute("data-festivals") || "").split(" ");
        const matchSearch = title.includes(input) || category.includes(input) || description.includes(input) || stock.includes(input);
        const matchType = !filters.type || itemType === filters.type;
        const matchFestival = !filters.festival || itemFestivals.includes(filters.festival);
        const isVisible = matchSearch && matchType && matchFestival;

        cards[i].style.display = isVisible ? "" : "none";
        if (isVisible) visibleCount++;
    }

    updateNoProductsMessage(visibleCount);
}

function initProductSearchFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("search") || "";
    const searchEl = document.getElementById("search");

    if (searchEl) {
        searchEl.value = query;
    }

    if (query) {
        searchProduct();
    } else {
        applyEmotionFilter();
    }
}

function handleNavSearch(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const input = form.querySelector("input[type='search']");
    const query = (input?.value || "").trim();

    if (!query) {
        window.location.href = "products.html";
        return;
    }

    const searchEl = document.getElementById("search");
    const isProductsPage = /(^|\/)products\.html$/i.test(window.location.pathname) || document.getElementById("productList");

    if (isProductsPage && searchEl) {
        const params = new URLSearchParams(window.location.search);
        params.set("search", query);
        history.replaceState(null, "", "products.html?" + params.toString());
        searchEl.value = query;
        searchProduct();
        return;
    }

    window.location.href = "products.html?search=" + encodeURIComponent(query);
}

async function openProduct(id) {
    const product = await findProductData(id);
    if (!product) return;
    const images = productImages(product);
    const productId = productIdValue(product);

    localStorage.setItem("productId", productId);
    localStorage.setItem("productName", product.name);
    localStorage.setItem("productPrice", product.price);
    localStorage.setItem("productImage", images[0]);
    localStorage.setItem("productImages", JSON.stringify(images));
    localStorage.setItem("productType", productTypeValue(product));
    localStorage.setItem("productCategory", productCategoryDisplay(product));
    localStorage.setItem("productDescription", productDescription(product));
    localStorage.setItem("productStock", productStock(product));
    localStorage.setItem("productRating", productRating(product));
    window.location.href = "product.html?id=" + encodeURIComponent(productId);
}

function getSavedProductImages() {
    try {
        const images = JSON.parse(localStorage.getItem("productImages") || "[]");
        if (Array.isArray(images) && images.length) {
            return productImages({ image: images[0], images });
        }
    } catch (error) {
        localStorage.removeItem("productImages");
    }

    return productImages({ image: localStorage.getItem("productImage") });
}

function setProductImage(image) {
    const imgEl = document.getElementById("productImg");
    if (imgEl && image) imgEl.src = image;

    document.querySelectorAll(".gallery-thumb").forEach(button => {
        button.classList.toggle("active", button.dataset.image === image);
    });
}

function productIdFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const queryId = params.get("id");
    const pathMatch = window.location.pathname.match(/\/products\/([^/]+)$/i);

    return queryId || (pathMatch ? decodeURIComponent(pathMatch[1]) : "");
}

function renderProductDetails(product) {
    product = normalizeShopProduct(product);
    const name = product.name || "Product";
    const price = Number(product.price || 0);
    const images = productImages(product);
    const image = images[0];
    const description = productDescription(product);
    const stock = productStock(product);
    const stockStatus = productStockStatus(product);
    const nameEl = document.getElementById("productName");
    const priceEl = document.getElementById("productPrice");
    const imgEl = document.getElementById("productImg");
    const descEl = document.getElementById("productDescription");
    const galleryEl = document.getElementById("productGallery");
    const categoryEl = document.getElementById("productCategory");
    const ratingEl = document.getElementById("productRating");
    const stockEl = document.getElementById("productStock");
    const qtyEl = document.getElementById("qty");

    orderPhotoStorage.product = null;
    renderPhotoPreview("customPhotoPreview", null);

    localStorage.setItem("productId", productIdValue(product));
    localStorage.setItem("productName", name);
    localStorage.setItem("productPrice", price);
    localStorage.setItem("productImage", image);
    localStorage.setItem("productImages", JSON.stringify(images));
    localStorage.setItem("productType", productTypeValue(product));
    localStorage.setItem("productCategory", productCategoryDisplay(product));
    localStorage.setItem("productDescription", description);
    localStorage.setItem("productStock", stock);
    localStorage.setItem("productRating", productRating(product));

    if (nameEl) nameEl.innerText = name;
    if (priceEl) priceEl.innerText = money(price);
    if (imgEl) imgEl.src = image;
    if (descEl) descEl.innerText = description;
    if (categoryEl) categoryEl.innerText = productCategoryDisplay(product);
    if (ratingEl) ratingEl.innerText = productRating(product);
    if (stockEl) {
        stockEl.innerText = stockStatus.label;
        stockEl.className = "stock-pill" + (stockStatus.className ? " " + stockStatus.className : "");
    }
    if (qtyEl) {
        qtyEl.max = stock > 0 ? String(stock) : "1";
        qtyEl.disabled = stock <= 0;
    }
    if (galleryEl) {
        galleryEl.innerHTML = images.map((item, index) => `
            <button type="button" class="gallery-thumb ${index === 0 ? "active" : ""}" data-image="${escapeHtml(item)}" onclick="setProductImage('${quote(item)}')">
                <img src="${item}" alt="${name} image ${index + 1}">
            </button>
        `).join("");
    }
}

async function loadProduct() {
    const routeId = productIdFromLocation();

    if (routeId) {
        const product = await findProductData(routeId);

        if (product) {
            renderProductDetails(product);
            return;
        }
    }

    renderProductDetails({
        id: localStorage.getItem("productId"),
        name: localStorage.getItem("productName") || "Product",
        price: Number(localStorage.getItem("productPrice") || 0),
        image: localStorage.getItem("productImage"),
        images: getSavedProductImages(),
        type: localStorage.getItem("productType"),
        category: localStorage.getItem("productCategory"),
        description: localStorage.getItem("productDescription"),
        stock: Number(localStorage.getItem("productStock") || 0),
        rating: Number(localStorage.getItem("productRating") || 0)
    });
}

async function orderProduct() {
    const productId = localStorage.getItem("productId");
    const qty = Number(document.getElementById("qty")?.value || 1);
    const added = await addProductToCart(productId, qty, collectProductCustomization());

    if (!added) return;

    if (!localStorage.getItem("loggedInUser")) {
        sessionStorage.removeItem("pendingDirectOrder");
        requireLogin("cart.html");
        return;
    }

    window.location.href = "cart.html";
}

function getPurchasedItems() {
    const orders = getLocalOrders();
    return orders.flatMap(order => order.items || []);
}

async function addCurrentProductToCart() {
    const productId = localStorage.getItem("productId");
    const qty = Number(document.getElementById("qty")?.value || 1);

    await addProductToCart(productId, qty, collectProductCustomization());
}

function generateGift() {
    const recipientName = getFieldValue("name");
    const budget = Number(document.getElementById("budget").value);
    const type = document.getElementById("occasion").value;
    const relationship = getFieldValue("relationship") || defaultRelationship(type);
    let product = "";
    let price = 0;

    if (type === "love") {
        product = budget <= 100 ? "Mini Love Keychain" : "Romantic Ornament";
        price = budget <= 100 ? 99 : 199;
    } else if (type === "birthday") {
        product = budget <= 150 ? "Birthday Keychain" : "Custom Keychain";
        price = budget <= 150 ? 120 : 199;
    } else {
        product = budget <= 100 ? "Friendship Band" : "Best Friend Keychain";
        price = budget <= 100 ? 99 : 149;
    }

    document.getElementById("result").innerText = `Suggested Gift: ${product} (${money(price)})`;
    localStorage.setItem("productName", product);
    localStorage.setItem("productPrice", price);
    localStorage.setItem("giftName", recipientName);
    localStorage.setItem("giftOccasion", type);
    localStorage.setItem("giftRelationship", relationship);
    document.getElementById("orderBtn").style.display = "block";
}

function filterEmotion(type) {
    localStorage.setItem("emotionFilter", type);
    localStorage.removeItem("festivalFilter");
    window.location.href = "products.html?emotion=" + encodeURIComponent(type);
}

function filterFestival(festival) {
    localStorage.setItem("festivalFilter", festival);
    localStorage.removeItem("emotionFilter");
    window.location.href = "products.html?festival=" + encodeURIComponent(festival);
}

function getActiveProductFilters() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("emotion") || "";
    const festival = params.get("festival") || "";

    return { type, festival };
}

function applyEmotionFilter() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("emotion");
    const festival = params.get("festival");
    const cards = document.getElementsByClassName("card");
    const titleEl = document.getElementById("collectionTitle");
    let visibleCount = 0;

    if (type) {
        localStorage.setItem("emotionFilter", type);
        localStorage.removeItem("festivalFilter");
    } else if (festival) {
        localStorage.setItem("festivalFilter", festival);
        localStorage.removeItem("emotionFilter");
    } else {
        localStorage.removeItem("emotionFilter");
        localStorage.removeItem("festivalFilter");
    }

    if (titleEl) {
        if (festivalCollections[festival]) {
            titleEl.innerText = festivalCollections[festival].title;
        } else if (type) {
            titleEl.innerText = productCategoryLabel(type);
        } else {
            titleEl.innerText = "All Products";
        }
    }

    for (let i = 0; i < cards.length; i++) {
        const itemType = cards[i].getAttribute("data-type");
        const itemFestivals = (cards[i].getAttribute("data-festivals") || "").split(" ");
        const matchType = !type || itemType === type;
        const matchFestival = !festival || itemFestivals.includes(festival);
        const isVisible = matchType && matchFestival;
        cards[i].style.display = isVisible ? "" : "none";
        if (isVisible) visibleCount++;
    }

    updateNoProductsMessage(visibleCount);
}

function clearEmotionFilter() {
    localStorage.removeItem("emotionFilter");
    localStorage.removeItem("festivalFilter");
    window.location.href = "products.html";
}

function updateNoProductsMessage(visibleCount) {
    const emptyEl = document.getElementById("noProducts");
    if (emptyEl) {
        emptyEl.style.display = visibleCount === 0 ? "block" : "none";
    }
}

function generateMessage() {
    const type = document.getElementById("occasion").value;
    const message = type === "birthday"
        ? "Happy Birthday! This gift is specially for you."
        : type === "love"
        ? "This gift carries all my love for you."
        : "You are an amazing friend. Enjoy this gift.";

    document.getElementById("msg").innerText = message;
    localStorage.setItem("customMessage", message);
}

function getPurchaseBasedOffer(items) {
    const names = items.map(item => item.name.toLowerCase()).join(" ");
    const totalSpent = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    if (totalSpent >= 300) {
        return "20% OFF on your next custom order";
    }

    if (names.includes("bracelet")) {
        return "15% OFF on your next keychain";
    }

    if (names.includes("keychain")) {
        return "Free name customization on your next order";
    }

    return "10% OFF on your next order";
}

function spinWheel() {
    const customerKey = getCustomerKey();
    const spinKey = "spinUsed:" + customerKey;
    const offerEl = document.getElementById("offer");

    if (localStorage.getItem(spinKey)) {
        const savedOffer = localStorage.getItem("offer") || "Already used";
        offerEl.innerText = "Spin already used. Your offer: " + savedOffer;
        return;
    }

    const purchasedItems = getPurchasedItems();
    const result = purchasedItems.length > 0
        ? getPurchaseBasedOffer(purchasedItems)
        : "Better luck next time";

    offerEl.innerText = "You got: " + result;
    localStorage.setItem("offer", result);
    localStorage.setItem(spinKey, "true");
}

let authMode = "login";

function authElements() {
    return {
        username: document.getElementById("username"),
        email: document.getElementById("email"),
        name: document.getElementById("name"),
        nameField: document.getElementById("nameField"),
        password: document.getElementById("password"),
        remember: document.getElementById("rememberUser"),
        title: document.getElementById("authTitle"),
        subtitle: document.getElementById("authSubtitle"),
        submit: document.getElementById("authSubmit"),
        switchButton: document.getElementById("authSwitch"),
        loginTab: document.getElementById("loginTab"),
        signupTab: document.getElementById("signupTab"),
        sessionMsg: document.getElementById("sessionMsg"),
        msg: document.getElementById("msg")
    };
}

function setAuthMessage(text, type = "") {
    const { msg } = authElements();
    if (!msg) return;

    msg.innerText = text;
    msg.className = "auth-message" + (type ? " " + type : "");
}

function setAuthMode(mode) {
    authMode = mode === "signup" ? "signup" : "login";
    const els = authElements();
    if (!els.title) return;

    const isSignup = authMode === "signup";
    els.title.innerText = isSignup ? "Create Account" : "Login";
    els.subtitle.innerText = isSignup
        ? "Create your account and start shopping."
        : "Enter your account details to continue.";
    els.submit.innerText = isSignup ? "Signup" : "Login";
    els.switchButton.innerText = isSignup ? "Already have an account?" : "Create account";
    els.password.autocomplete = isSignup ? "new-password" : "current-password";
    if (els.nameField) els.nameField.hidden = !isSignup;
    if (els.name) els.name.required = isSignup;
    els.loginTab.classList.toggle("active", !isSignup);
    els.signupTab.classList.toggle("active", isSignup);
    setAuthMessage("");
}

function toggleAuthMode() {
    setAuthMode(authMode === "login" ? "signup" : "login");
}

function initAuthPage() {
    showUser();
    updateCartCount();

    const params = new URLSearchParams(window.location.search);
    setAuthMode(params.get("mode") === "signup" ? "signup" : "login");

    const els = authElements();
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const wantsAdmin = getPendingLoginRedirect() === "admin.html";
    let loggedInUser = localStorage.getItem("loggedInUser");
    let role = localStorage.getItem("userRole");

    if (wantsAdmin && loggedInUser && role !== "admin") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userRole");
        loggedInUser = "";
        role = "";
        setAuthMessage("Login with smartornaments.shop@gmail.com / admin123 to open the admin panel.", "error");
    }

    if (wantsAdmin && (els.email || els.username)) {
        (els.email || els.username).value = adminEmail;
    } else if (rememberedUsername && (els.email || els.username)) {
        (els.email || els.username).value = rememberedUsername;
        if (els.remember) els.remember.checked = true;
    }

    if (loggedInUser && els.sessionMsg) {
        const target = role === "admin" ? "admin.html" : getPendingLoginRedirect() || "index.html";
        els.sessionMsg.innerHTML = `Signed in as <b>${escapeHtml(loggedInUser)}</b>. <a href="${target}">Continue</a>`;
    }
}

function submitAuth(event) {
    event.preventDefault();
    return authMode === "signup" ? signup() : login();
}

function getAuthCredentials() {
    const { username, email, name, password } = authElements();
    const enteredUsername = (email || username)?.value.trim() || "";
    const enteredName = name?.value.trim() || "";
    const enteredPassword = password?.value || "";

    if (!enteredUsername || !enteredPassword) {
        setAuthMessage("Enter email or admin username and password", "error");
        return null;
    }

    return {
        username: enteredUsername,
        email: enteredUsername,
        name: enteredName || enteredUsername.split("@")[0],
        password: enteredPassword
    };
}

async function phpAuthRequest(path, credentials) {
    const formData = new FormData();
    formData.append("name", credentials.name);
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);

    const response = await fetch(path, {
        method: "POST",
        body: formData,
        credentials: "same-origin"
    });
    const text = (await response.text()).trim();

    if (!response.ok) {
        const contentType = (response.headers.get("Content-Type") || "").toLowerCase();
        const isHtml404 = response.status === 404 && contentType.includes("text/html");
        throw new Error(isHtml404 ? "Request failed" : text || "Request failed");
    }

    return text;
}

function rememberUsername(username) {
    const { remember } = authElements();
    if (remember?.checked) {
        localStorage.setItem("rememberedUsername", username);
    } else {
        localStorage.removeItem("rememberedUsername");
    }
}

function isSafeLocalRedirect(value) {
    return /^[a-z0-9_.-]+\.html(?:[?#].*)?$/i.test(value || "");
}

function getPendingLoginRedirect(clear = false) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || sessionStorage.getItem("loginRedirect") || "";
    const safeRedirect = isSafeLocalRedirect(redirect) ? redirect : "";

    if (clear) {
        sessionStorage.removeItem("loginRedirect");
    }

    return safeRedirect;
}

function getCurrentPage() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    return page + window.location.search + window.location.hash;
}

function loginDestination(role) {
    if (role === "admin") return "admin.html";
    return getPendingLoginRedirect(true) || "index.html";
}

function resumePendingDirectOrder() {
    const pendingOrder = takePendingDirectOrder();
    if (!pendingOrder) return false;

    sessionStorage.removeItem("loginRedirect");
    addCartItem(pendingOrder.product, pendingOrder.price);
    setAuthMessage("Login successful. Opening cart...", "success");
    setTimeout(() => {
        window.location.href = "cart.html";
    }, 700);

    return true;
}

function completeLogin(user, token = "") {
    const username = user.username || user.email || "";
    const role = user.role || (isAdminLoginId(username) ? "admin" : "customer");

    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("userRole", role);

    if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
    }

    rememberUsername(username);
    if (role === "admin") {
        sessionStorage.removeItem("pendingDirectOrder");
    } else if (resumePendingDirectOrder()) {
        return;
    }

    setAuthMessage("Login successful", "success");
    syncCartAfterLogin().finally(() => {
        setTimeout(() => window.location.href = loginDestination(role), 700);
    });
}

function getLocalUsers() {
    let users = [];

    try {
        const savedUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        users = Array.isArray(savedUsers) ? savedUsers : [];
    } catch (error) {
        users = [];
    }

    if (!users.some(user => user.username.toLowerCase() === adminEmail)) {
        users.push({ username: adminEmail, password: "admin123", role: "admin" });
    }

    if (!users.some(user => user.username.toLowerCase() === legacyAdminUsername)) {
        users.push({ username: legacyAdminUsername, password: "admin123", role: "admin" });
    }

    const legacyUsername = localStorage.getItem("user");
    const legacyPassword = localStorage.getItem("pass");
    const hasLegacyUser = legacyUsername && legacyPassword
        && !users.some(user => user.username.toLowerCase() === legacyUsername.toLowerCase());

    if (hasLegacyUser) {
        users.push({
            username: legacyUsername,
            password: legacyPassword,
            role: isAdminLoginId(legacyUsername) ? "admin" : "customer"
        });
    }

    return users;
}

function saveLocalUsers(users) {
    localStorage.setItem("localUsers", JSON.stringify(users));
}

function getLocalCart() {
    try {
        const rawCart = localStorage.getItem(cartStorageKey) || localStorage.getItem(cartItemsStorageKey) || "[]";
        const cart = JSON.parse(rawCart);
        return Array.isArray(cart)
            ? cart.map(item => ({ ...item, qty: Number(item.qty || item.quantity || 1) }))
            : [];
    } catch (error) {
        localStorage.removeItem(cartStorageKey);
        localStorage.removeItem(cartItemsStorageKey);
        return [];
    }
}

function saveLocalCart(cart, syncRemote = true) {
    const items = Array.isArray(cart) ? cart : [];
    localStorage.setItem(cartStorageKey, JSON.stringify(items));
    localStorage.setItem(cartItemsStorageKey, JSON.stringify(items));
    updateCartCount();

    if (syncRemote) {
        saveCartToBackend();
    }
}

function hasAuthToken() {
    return Boolean(localStorage.getItem("authToken") || localStorage.getItem("token"));
}

async function saveCartToBackend(cart = getLocalCart()) {
    if (!useBackend || !hasAuthToken()) return;

    try {
        await apiRequest("/api/cart", {
            method: "PUT",
            body: JSON.stringify({ items: cart })
        });
    } catch (error) {
        if (!isApiUnavailableError(error)) {
            console.warn(error.message);
        }
    }
}

function cartItemKey(item) {
    return [
        item.productId || "",
        item.name,
        Number(item.price || 0),
        JSON.stringify(cleanCustomizationData(item.customization))
    ].join("|");
}

function mergeCartItems(localItems, remoteItems) {
    const merged = new Map();

    [...(remoteItems || []), ...(localItems || [])].forEach(item => {
        const key = cartItemKey(item);
        const current = merged.get(key);
        const qty = Number(item.qty || 1);

        if (current) {
            current.qty += qty;
        } else {
            merged.set(key, { ...item, qty });
        }
    });

    return Array.from(merged.values());
}

async function syncCartAfterLogin() {
    if (!useBackend || !hasAuthToken()) return;

    try {
        const data = await apiRequest("/api/cart");
        const remoteItems = data.cart?.items || [];
        const merged = mergeCartItems(getLocalCart(), remoteItems);
        saveLocalCart(merged, false);
        await saveCartToBackend(merged);
    } catch (error) {
        if (!isApiUnavailableError(error)) {
            console.warn(error.message);
        }
    }
}

function getLocalOrders() {
    try {
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        localStorage.removeItem("orders");
        return [];
    }
}

function saveLocalOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function orderTimestamp() {
    return new Date().toLocaleString();
}

function normalizeOrderStatus(status) {
    if (status === "Pending") return "Processing";
    if (status === "Confirmed" || status === "Making") return "Packed";
    return orderStatuses.includes(status) ? status : "Processing";
}

function nextOrderStatus(currentStatus) {
    const current = normalizeOrderStatus(currentStatus);
    const index = orderStatuses.indexOf(current);
    return orderStatuses[Math.min(index + 1, orderStatuses.length - 1)];
}

function orderStatusTimeField(status) {
    if (status === "Packed") return "packedAt";
    if (status === "Shipped") return "shippedAt";
    if (status === "Delivered") return "deliveredAt";
    return "placedAt";
}

function applyOrderStatus(order, status) {
    const previousStatus = normalizeOrderStatus(order.status);
    const nextStatus = normalizeOrderStatus(status || previousStatus);
    const now = orderTimestamp();

    order.status = nextStatus;
    order.updatedAt = now;

    if (previousStatus !== nextStatus) {
        const field = orderStatusTimeField(nextStatus);
        order[field] = order[field] || now;
    }

    if (nextStatus === "Packed") {
        order.packedAt = order.packedAt || order.makingAt || now;
        order.makingAt = order.makingAt || order.packedAt;
        order.confirmedAt = order.confirmedAt || order.packedAt || now;
    }

    return order;
}

function createLocalOrder(orderData) {
    const now = orderTimestamp();
    const order = {
        ...orderData,
        id: nextOrderId(),
        status: "Processing",
        paymentStatus: orderData.paymentStatus || "Pending",
        date: now,
        placedAt: now,
        updatedAt: now
    };

    const orders = getLocalOrders();
    orders.push(order);
    saveLocalOrders(orders);
    addLocalNotification(
        "order",
        "New order received",
        `${order.customer?.name || "Customer"} placed ${order.id} for ${money(order.total || 0)}`,
        { orderId: order.id }
    );
    return order;
}

function saveLocalOrderSnapshot(order) {
    const orders = getLocalOrders();
    const index = orders.findIndex(item => item.id === order.id);

    if (index >= 0) {
        orders[index] = order;
    } else {
        orders.push(order);
    }

    saveLocalOrders(orders);
}

function getWhatsAppPhoneNumber(phone) {
    const digits = String(phone || "").replace(/\D/g, "");

    if (!digits) return "";
    if (digits.length === 10) return "91" + digits;
    if (digits.length === 11 && digits.startsWith("0")) return "91" + digits.slice(1);

    return digits;
}

function getAppPageUrl(page) {
    if (!/^https?:$/.test(location.protocol)) return "";

    const basePath = location.pathname.replace(/[^/]*$/, page);
    return location.origin + basePath;
}

function buildOrderConfirmationMessage(order) {
    const customer = order.customer || {};
    const trackingUrl = getAppPageUrl("orders.html");
    const status = normalizeOrderStatus(order.status);
    const lines = [
        `Hi ${customer.name || "there"}, your SmartOrnaments order update is ready.`,
        "",
        `Order ID: ${order.id || "Not provided"}`,
        `Total: ${money(order.total || 0)}`,
        `Status: ${status}`,
        "",
        status === "Processing"
            ? "We received your order and it is being prepared."
            : status === "Packed"
            ? "Your order has been packed and is ready for dispatch."
            : status === "Shipped"
            ? "Your order has been shipped."
            : status === "Delivered"
            ? "Your order has been delivered. Thank you for shopping with us."
            : "Your order is pending."
    ];

    if (trackingUrl) {
        lines.push(`Track your order: ${trackingUrl}`);
    } else {
        lines.push("Track your order from the Orders page after login.");
    }

    return lines.join("\n");
}

function openOrderConfirmationWhatsApp(order, popupWindow = null) {
    const phone = getWhatsAppPhoneNumber(order.customer?.phone);

    if (!phone) {
        if (popupWindow && !popupWindow.closed) popupWindow.close();
        alert("Customer phone number is missing. Confirmation WhatsApp not opened.");
        return;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildOrderConfirmationMessage(order))}`;

    if (popupWindow && !popupWindow.closed) {
        popupWindow.location.href = url;
        return;
    }

    window.open(url, "_blank");
}

async function saveOrderToPhp(orderData) {
    const data = await phpOrderRequest("save_order.php", {
        method: "POST",
        body: JSON.stringify(orderData)
    });

    return data.order;
}

async function signup() {
    const credentials = getAuthCredentials();
    if (!credentials) return false;

    if (credentials.password.length < 4) {
        setAuthMessage("Password must be at least 4 characters", "error");
        return false;
    }

    if (useBackend) {
        try {
            await apiRequest("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(credentials)
            });
            setAuthMessage("Account created. Logging in...", "success");
            await login();
            return true;
        } catch (error) {
            if (isApiUnavailableError(error)) {
                console.warn(error.message);
            } else {
                setAuthMessage(error.message, "error");
                return false;
            }
        }

        try {
            await apiRequest("/api/signup", {
                method: "POST",
                body: JSON.stringify(credentials)
            });
            setAuthMessage("Account created. Logging in...", "success");
            await login();
            return true;
        } catch (error) {
            if (isApiUnavailableError(error)) {
                console.warn(error.message);
            } else {
                setAuthMessage(error.message, "error");
                return false;
            }
        }

        try {
            const message = await phpAuthRequest("signup.php", credentials);
            if (!/successful/i.test(message)) {
                setAuthMessage(message || "Signup failed", "error");
                return false;
            }

            completeLogin({ username: credentials.name || credentials.email, role: "customer" });
            return true;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                setAuthMessage(error.message, "error");
                return false;
            }
        }
    }

    const users = getLocalUsers();
    const exists = users.some(user => user.username.toLowerCase() === credentials.username.toLowerCase());

    if (exists) {
        setAuthMessage("Username already exists", "error");
        return false;
    }

    const user = {
        username: credentials.username,
        password: credentials.password,
        role: "customer"
    };

    users.push(user);
    saveLocalUsers(users);
    localStorage.setItem("user", credentials.username);
    localStorage.setItem("pass", credentials.password);
    completeLogin(user);
    return true;
}

async function login() {
    const credentials = getAuthCredentials();
    if (!credentials) return false;

    if (useBackend) {
        try {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(credentials)
            });
            completeLogin(data.user, data.token);
            return true;
        } catch (error) {
            if (isApiUnavailableError(error)) {
                console.warn(error.message);
            } else {
                setAuthMessage(error.message, "error");
                return false;
            }
        }

        try {
            const data = await apiRequest("/api/login", {
                method: "POST",
                body: JSON.stringify(credentials)
            });
            completeLogin(data.user, data.token);
            return true;
        } catch (error) {
            if (isApiUnavailableError(error)) {
                console.warn(error.message);
            } else {
                setAuthMessage(error.message, "error");
                return false;
            }
        }

        try {
            const message = await phpAuthRequest("login.php", credentials);
            if (!/successful/i.test(message)) {
                setAuthMessage(message || "Invalid login", "error");
                return false;
            }

            completeLogin({
                username: isAdminLoginId(credentials.username) ? adminEmail : credentials.email,
                role: isAdminLoginId(credentials.username) ? "admin" : "customer"
            });
            return true;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                setAuthMessage(error.message, "error");
                return false;
            }
        }
    }

    const user = getLocalUsers().find(item =>
        item.username.toLowerCase() === credentials.username.toLowerCase()
        && item.password === credentials.password
    );

    if (!user) {
        setAuthMessage("Invalid login. Admin: smartornaments.shop@gmail.com / admin123.", "error");
        return false;
    }

    completeLogin(user);
    return true;
}

function togglePassword(button) {
    const passwordInput = document.getElementById("password");
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    button.innerText = isHidden ? "Hide" : "Show";
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function showUser() {
    const user = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");
    const displays = document.querySelectorAll("#userDisplay");

    displays.forEach(display => {
        display.classList.add("user-menu");

        if (!user) {
            display.innerHTML = "";
            return;
        }

        const nav = display.closest("nav");
        const hasLoginButton = nav?.querySelector(".login-btn");
        const adminLink = role === "admin" ? `<a href="admin.html">Admin</a>` : "";
        const logoutButton = hasLoginButton ? "" : `<button type="button" onclick="logout(event)">Logout</button>`;

        display.innerHTML = `
            <span class="user-chip">Hi, ${escapeHtml(user)}</span>
            ${adminLink}
            ${logoutButton}
        `;
    });

    document.querySelectorAll(".login-btn").forEach(link => {
        if (!user) {
            link.href = "login.html";
            link.innerText = "Login";
            link.onclick = null;
            link.classList.remove("is-logout");
            return;
        }

        link.href = "#";
        link.innerText = "Logout";
        link.onclick = logout;
        link.classList.add("is-logout");
    });
}

function ensureNavbarControls() {
    document.querySelectorAll("nav").forEach((nav, index) => {
        nav.classList.add("site-nav");

        const links = nav.querySelector("ul");
        if (links) links.classList.add("nav-links");

        let actions = nav.querySelector(".nav-actions, .nav-right");
        if (!actions) {
            actions = document.createElement("div");
            nav.appendChild(actions);
        }

        actions.classList.add("nav-actions");

        const userDisplay = nav.querySelector("#userDisplay");
        if (userDisplay && !actions.contains(userDisplay)) {
            actions.appendChild(userDisplay);
        }

        const cartLink = nav.querySelector('a[href="cart.html"]');
        if (cartLink) {
            const cartItem = cartLink.closest("li");
            cartLink.classList.add("cart-link");
            const cartCount = cartLink.querySelector("#cartCount");
            if (cartCount) cartCount.setAttribute("data-cart-count", "");

            if (!actions.contains(cartLink)) {
                actions.insertBefore(cartLink, actions.firstChild);
            }

            if (cartItem && cartItem.parentElement && cartItem.children.length === 0) {
                cartItem.remove();
            }
        }

        if (!actions.querySelector(".login-btn")) {
            const loginLink = document.createElement("a");
            loginLink.href = "login.html";
            loginLink.className = "login-btn";
            loginLink.innerText = "Login";
            actions.appendChild(loginLink);
        }

        if (!nav.querySelector(".nav-search")) {
            const form = document.createElement("form");
            form.className = "nav-search";
            form.onsubmit = handleNavSearch;
            form.innerHTML = `
                <label class="sr-only" for="navSearch${index}">Search products</label>
                <input id="navSearch${index}" type="search" name="search" placeholder="Search custom gifts">
                <button type="submit" aria-label="Search products"></button>
            `;
            nav.insertBefore(form, actions);
        }
    });

    showUser();
    updateCartCount();
}

function initScrollAnimations() {
    const animatedEls = document.querySelectorAll("[data-animate]");
    if (!animatedEls.length) return;

    if (!("IntersectionObserver" in window)) {
        animatedEls.forEach(el => el.classList.add("show"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    animatedEls.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
    ensureNavbarControls();
    initScrollAnimations();
});

function requireLogin(redirectTo = getCurrentPage()) {
    if (localStorage.getItem("loggedInUser")) {
        return true;
    }

    const redirect = isSafeLocalRedirect(redirectTo) ? redirectTo : "index.html";
    sessionStorage.setItem("loginRedirect", redirect);
    window.location.href = "login.html?redirect=" + encodeURIComponent(redirect);
    return false;
}

async function addToCart(name, price) {
    const product = (await getProductsData()).find(item =>
        String(item.name || "").toLowerCase() === String(name || "").toLowerCase()
    );

    if (product) {
        await addProductToCart(productIdValue(product));
        return;
    }

    addCartItem(name, price);
    alert("Added to cart");
}

function loadCart() {
    const cart = getLocalCart();
    const container = document.getElementById("cartItems");
    const couponField = document.getElementById("couponCode");

    initLocationDropdowns();
    restoreCheckoutDetails();
    container.innerHTML = "";
    if (couponField) couponField.value = getAppliedCouponCode();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-panel">
                <h3>Your cart is empty.</h3>
                <p>Add a personalized gift to start your order.</p>
                <a href="products.html" class="btn primary-btn">Browse Products</a>
            </div>
        `;
        document.getElementById("total").innerText = "";
        renderPriceBreakdown("cartPriceBreakdown", cart);
        updateOrderSummary();
        return;
    }

    cart.forEach((item, i) => {
        const qty = Number(item.qty || 1);
        const image = item.image || "images/Logo.png";
        container.innerHTML += `
            <div class="cart-card">
                <img class="cart-item-image" src="${image}" alt="${escapeHtml(item.name || "Product")}">
                <div>
                    <h3>${item.name}</h3>
                    <p>${money(item.price)} each</p>
                    <p><b>Subtotal:</b> ${money(item.price * qty)}</p>
                    ${customizationDetailsHtml(item.customization)}
                </div>
                <div class="qty-controls">
                    <button onclick="changeCartQty(${i}, -1)">-</button>
                    <span>${qty}</span>
                    <button onclick="changeCartQty(${i}, 1)">+</button>
                </div>
                <button onclick="removeItem(${i})">Remove</button>
            </div>
        `;
    });

    const pricing = getCartPricing(cart);
    document.getElementById("total").innerText = "Total: " + money(pricing.total);
    renderPriceBreakdown("cartPriceBreakdown", cart);
    updateOrderSummary();
}

function removeItem(index) {
    const cart = getLocalCart();
    cart.splice(index, 1);
    saveLocalCart(cart);
    loadCart();
}

function changeCartQty(index, change) {
    const cart = getLocalCart();
    const item = cart[index];
    if (!item) return;

    if (change > 0) {
        const product = getProducts().find(candidate =>
            (item.productId && productIdValue(candidate) === item.productId)
            || String(candidate.name || "").toLowerCase() === String(item.name || "").toLowerCase()
        );

        if (product && Number(item.qty || 1) + change > productStock(product)) {
            alert(`Only ${productStock(product)} available for ${product.name}.`);
            return;
        }
    }

    item.qty = Number(item.qty || 1) + change;

    if (item.qty <= 0) {
        cart.splice(index, 1);
    }

    saveLocalCart(cart);
    loadCart();
}

function nextOrderId() {
    const current = Number(localStorage.getItem("lastOrderNumber") || 1000) + 1;
    localStorage.setItem("lastOrderNumber", current);
    return "SO-" + current;
}

function toggleNav(button) {
    const nav = button?.closest("nav") || document.querySelector("nav");
    if (!nav) return;

    const isOpen = nav.classList.toggle("open");
    if (button) button.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function getCartTotal(cart) {
    return cart.reduce((sum, item) => {
        const qty = Number(item.qty || 1);
        return sum + Number(item.price || 0) * qty;
    }, 0);
}

function normalizeCouponCode(value = "") {
    return String(value || "").trim().toUpperCase();
}

function getAppliedCouponCode() {
    return normalizeCouponCode(localStorage.getItem("couponCode") || "");
}

function getCouponDiscount(subtotal, code = getAppliedCouponCode()) {
    const rule = couponRules[normalizeCouponCode(code)];

    if (!rule || subtotal <= 0) {
        return 0;
    }

    if (rule.type === "percent") {
        return Math.min(Math.round(subtotal * rule.value / 100), subtotal);
    }

    return Math.min(rule.value, subtotal);
}

function getShippingCharge(amountAfterDiscount) {
    return amountAfterDiscount > 0 && amountAfterDiscount < 999 ? 99 : 0;
}

function getCartPricing(cart = getLocalCart()) {
    const subtotal = getCartTotal(cart);
    const couponCode = getAppliedCouponCode();
    const discount = getCouponDiscount(subtotal, couponCode);
    const discountedSubtotal = Math.max(subtotal - discount, 0);
    const shipping = getShippingCharge(discountedSubtotal);
    const total = discountedSubtotal + shipping;
    const hasCoupon = Boolean(couponCode && couponRules[couponCode] && discount > 0);

    return {
        subtotal,
        couponCode: hasCoupon ? couponCode : "",
        discount,
        shipping,
        total,
        offer: hasCoupon ? `${couponCode} (-${money(discount)})` : "No offer"
    };
}

function renderPriceBreakdown(targetId, cart = getLocalCart()) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const pricing = getCartPricing(cart);
    target.innerHTML = `
        <p><span>Subtotal</span><b>${money(pricing.subtotal)}</b></p>
        <p><span>Discount</span><b>-${money(pricing.discount)}</b></p>
        <p><span>Shipping</span><b>${pricing.shipping ? money(pricing.shipping) : "Free"}</b></p>
        <hr>
        <p class="grand-total"><span>Total</span><b>${money(pricing.total)}</b></p>
    `;
}

function applyCoupon() {
    const field = document.getElementById("couponCode");
    const status = document.getElementById("couponStatus");
    const code = normalizeCouponCode(field?.value || "");
    const cart = getLocalCart();

    if (!code) {
        localStorage.removeItem("couponCode");
        localStorage.setItem("offer", "No offer");
        if (status) status.innerText = "Coupon cleared.";
    } else if (!couponRules[code]) {
        localStorage.removeItem("couponCode");
        localStorage.setItem("offer", "No offer");
        if (status) status.innerText = "Invalid coupon code.";
    } else {
        localStorage.setItem("couponCode", code);
        localStorage.setItem("offer", getCartPricing(cart).offer);
        if (status) status.innerText = `${couponRules[code].label} applied.`;
    }

    updateOrderSummary();
    renderPriceBreakdown("cartPriceBreakdown", cart);
    renderPriceBreakdown("checkoutPriceBreakdown", cart);

    if (document.getElementById("cartItems")) {
        loadCart();
    }
}

function clearCoupon() {
    const field = document.getElementById("couponCode");
    localStorage.removeItem("couponCode");
    localStorage.setItem("offer", "No offer");
    if (field) field.value = "";
    updateOrderSummary();
    renderPriceBreakdown("cartPriceBreakdown");
    renderPriceBreakdown("checkoutPriceBreakdown");
    if (document.getElementById("cartItems")) loadCart();
}

async function validateCartStock(cart) {
    const products = await getProductsData();

    for (const item of cart) {
        const product = products.find(candidate =>
            (item.productId && productIdValue(candidate) === item.productId)
            || String(candidate.name || "").toLowerCase() === String(item.name || "").toLowerCase()
        );

        if (!product) {
            continue;
        }

        const qty = Number(item.qty || 1);
        const stock = productStock(product);

        if (stock < qty) {
            return `${product.name} has only ${stock} left in stock.`;
        }
    }

    return "";
}

function reduceLocalProductStock(cart) {
    const products = getProducts();
    let changed = false;

    cart.forEach(item => {
        const product = products.find(candidate =>
            (item.productId && productIdValue(candidate) === item.productId)
            || String(candidate.name || "").toLowerCase() === String(item.name || "").toLowerCase()
        );

        if (!product) return;

        product.stock = Math.max(productStock(product) - Number(item.qty || 1), 0);
        changed = true;
    });

    if (changed) {
        saveProducts(products);
    }
}

function updateOrderSummary() {
    const summary = document.getElementById("orderSummary");
    if (!summary) return;

    const cart = getLocalCart();
    const pricing = getCartPricing(cart);
    const couponField = document.getElementById("couponCode");
    if (couponField && couponField.value.trim() === "") couponField.value = pricing.couponCode;

    if (cart.length === 0) {
        summary.innerHTML = "<p>Add products to see your checkout summary.</p>";
        renderPriceBreakdown("checkoutPriceBreakdown", cart);
        return;
    }

    const items = cart.map(item => {
        const qty = Number(item.qty || 1);
        return `
            <p>${item.name} x ${qty} - ${money(item.price * qty)}</p>
            ${customizationDetailsHtml(item.customization)}
        `;
    }).join("");
    const checkoutPhoto = orderPhotoStorage.checkout;
    const orderCustomization = cleanCustomizationData({
        customName: getFieldValue("customizationName"),
        color: getFieldValue("customizationColor"),
        photo: checkoutPhoto
    });
    const orderCustomizationHtml = hasCustomizationData(orderCustomization)
        ? customizationDetailsHtml(orderCustomization)
        : "";

    summary.innerHTML = `
        ${items}
        ${orderCustomizationHtml}
        <hr>
        <p><b>Subtotal:</b> ${money(pricing.subtotal)}</p>
        <p><b>Discount:</b> ${money(pricing.discount)}</p>
        <p><b>Shipping:</b> ${pricing.shipping ? money(pricing.shipping) : "Free"}</p>
        <p><b>Total:</b> ${money(pricing.total)}</p>
        <p><b>Offer:</b> ${pricing.offer}</p>
    `;
    renderPriceBreakdown("checkoutPriceBreakdown", cart);
}

function getCheckoutDetails() {
    const savedUser = localStorage.getItem("loggedInUser");
    const flatNo = getFieldValue("flatNo");
    const areaStreet = getFieldValue("areaStreet");
    const city = getFieldValue("city") || getFieldValue("district");
    const address = [flatNo, areaStreet, city].filter(Boolean).join(", ");

    return {
        name: getFieldValue("userName") || savedUser || "",
        phone: getFieldValue("phone"),
        flatNo,
        areaStreet,
        addressType: getFieldValue("addressType") || "Home",
        address,
        state: getFieldValue("state"),
        district: getFieldValue("district"),
        city,
        buildingStreet: areaStreet,
        pincode: getFieldValue("pincode"),
        paymentMethod: getFieldValue("paymentMethod") || "razorpay",
        customizationName: getFieldValue("customizationName"),
        customizationColor: getFieldValue("customizationColor"),
        customizationPhotoName: orderPhotoStorage.checkout?.name || "",
        customizationPhotoData: orderPhotoStorage.checkout?.dataUrl || "",
        customization: getFieldValue("customization") || "None",
        deliveryNote: getFieldValue("deliveryNote") || "None"
    };
}

function saveCheckoutDetails(details) {
    sessionStorage.setItem("pendingCheckoutDetails", JSON.stringify(details));
}

function restoreCheckoutDetails() {
    const savedDetails = sessionStorage.getItem("pendingCheckoutDetails");
    initLocationDropdowns();
    if (!savedDetails) {
        const savedAddresses = getSavedAddresses();
        if (savedAddresses.length > 0) {
            fillCheckoutFields(savedAddresses[0]);
        }
        return;
    }

    try {
        const details = JSON.parse(savedDetails);
        const fields = {
            userName: details.name,
            phone: details.phone,
            flatNo: details.flatNo || "",
            areaStreet: details.areaStreet || details.buildingStreet || details.address,
            addressType: details.addressType || "Home",
            state: details.state,
            district: details.district,
            city: details.city || details.district || "",
            pincode: details.pincode,
            paymentMethod: details.paymentMethod || "razorpay",
            customizationName: details.customizationName || "",
            customizationColor: details.customizationColor || "",
            customization: details.customization === "None" ? "" : details.customization,
            deliveryNote: details.deliveryNote === "None" ? "" : details.deliveryNote
        };

        initLocationDropdowns(fields.state || "", fields.district || "");
        orderPhotoStorage.checkout = details.customizationPhotoData
            ? { name: details.customizationPhotoName || "Customization photo", dataUrl: details.customizationPhotoData }
            : null;
        renderPhotoPreview("checkoutPhotoPreview", orderPhotoStorage.checkout);

        fillCheckoutFields(fields);
    } catch (error) {
        sessionStorage.removeItem("pendingCheckoutDetails");
    }
}

function addressStorageKey() {
    return "smartOrnamentsAddresses:" + getCustomerKey();
}

function getSavedAddresses() {
    try {
        const addresses = JSON.parse(localStorage.getItem(addressStorageKey()) || "[]");
        return Array.isArray(addresses) ? addresses : [];
    } catch (error) {
        localStorage.removeItem(addressStorageKey());
        return [];
    }
}

function saveCustomerAddress(details) {
    const address = {
        name: details.name,
        phone: details.phone,
        flatNo: details.flatNo,
        areaStreet: details.areaStreet,
        addressType: details.addressType,
        state: details.state,
        district: details.district,
        city: details.city,
        pincode: details.pincode
    };
    const key = [
        address.phone,
        address.flatNo,
        address.areaStreet,
        address.city,
        address.pincode
    ].map(value => String(value || "").toLowerCase()).join("|");
    const addresses = getSavedAddresses().filter(item => {
        const itemKey = [
            item.phone,
            item.flatNo,
            item.areaStreet,
            item.city,
            item.pincode
        ].map(value => String(value || "").toLowerCase()).join("|");

        return itemKey !== key;
    });

    addresses.unshift(address);
    localStorage.setItem(addressStorageKey(), JSON.stringify(addresses.slice(0, 4)));
}

function fillCheckoutFields(details = {}) {
    if (details.state) initLocationDropdowns(details.state || "", details.district || "");

    Object.entries(details).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field && value !== undefined && value !== null) field.value = value;
    });

    updateOrderSummary();
}

function renderSavedAddresses() {
    const container = document.getElementById("savedAddressList");
    if (!container) return;

    const addresses = getSavedAddresses();
    if (addresses.length === 0) {
        container.innerHTML = "<p>No saved addresses yet.</p>";
        return;
    }

    container.innerHTML = addresses.map((address, index) => `
        <button type="button" class="saved-address" onclick="useSavedAddress(${index})">
            <b>${escapeHtml(address.addressType || "Address")}</b>
            <span>${escapeHtml([address.flatNo, address.areaStreet, address.city, address.pincode].filter(Boolean).join(", "))}</span>
        </button>
    `).join("");
}

function useSavedAddress(index) {
    const address = getSavedAddresses()[index];
    if (!address) return;

    fillCheckoutFields(address);
}

function renderCheckoutItems() {
    const container = document.getElementById("checkoutItems");
    if (!container) return;

    const cart = getLocalCart();
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-panel">
                <h3>Your cart is empty.</h3>
                <p>Add products before checkout.</p>
                <a href="products.html" class="btn primary-btn">Continue Shopping</a>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => {
        const qty = Number(item.qty || 1);
        return `
            <div class="checkout-item">
                <img src="${item.image || "images/Logo.png"}" alt="${escapeHtml(item.name || "Product")}">
                <div>
                    <b>${escapeHtml(item.name || "Product")}</b>
                    <span>${qty} x ${money(item.price)}</span>
                </div>
                <strong>${money(Number(item.price || 0) * qty)}</strong>
            </div>
        `;
    }).join("");
}

function initCheckoutPage() {
    initLocationDropdowns();
    restoreCheckoutDetails();
    renderSavedAddresses();
    renderCheckoutItems();
    updateOrderSummary();
    resumePendingCheckout();
}

function resumePendingCheckout() {
    if (!sessionStorage.getItem("pendingCheckout") || !localStorage.getItem("loggedInUser")) return;

    sessionStorage.removeItem("pendingCheckout");
    const checkoutMsg = document.getElementById("checkoutMsg");
    if (checkoutMsg) checkoutMsg.innerText = "Login successful. Resuming checkout...";
    setTimeout(() => checkout(), 400);
}

function validateCheckout(details) {
    if (!details.name || !details.phone || !details.flatNo || !details.areaStreet || !details.addressType || !details.state || !details.city || !details.pincode || !details.paymentMethod) {
        return "Name, phone number, address, city, state, pincode, and payment method are required.";
    }

    if (details.phone.replace(/\D/g, "").length < 10) {
        return "Enter a valid phone number.";
    }

    if (details.pincode.replace(/\D/g, "").length !== 6) {
        return "Enter a valid 6-digit pincode.";
    }

    return "";
}

function updateCartCount() {
    const cart = getLocalCart();
    const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);
    document.querySelectorAll("#cartCount, [data-cart-count]").forEach(el => {
        el.innerText = totalQty;
    });
}
async function checkout() {
    const cart = getLocalCart();

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const details = getCheckoutDetails();
    const checkoutMsg = document.getElementById("checkoutMsg");
    const validationError = validateCheckout(details);

    if (validationError) {
        checkoutMsg.innerText = validationError;
        return;
    }

    const stockError = await validateCartStock(cart);
    if (stockError) {
        checkoutMsg.innerText = stockError;
        return;
    }

    if (!localStorage.getItem("loggedInUser")) {
        saveCheckoutDetails(details);
        sessionStorage.setItem("pendingCheckout", "true");
        requireLogin("checkout.html");
        return;
    }

    const pricing = getCartPricing(cart);
    const paymentMethod = details.paymentMethod || "razorpay";
    const message = buildCheckoutMessage(cart, details, pricing);

    const orderData = {
        items: cart,
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        shipping: pricing.shipping,
        total: pricing.total,
        couponCode: pricing.couponCode,
        customer: details,
        offer: pricing.offer,
        paymentMethod,
        paymentStatus: "Pending",
        status: "Processing"
    };

    if (paymentMethod === "razorpay") {
        await startRazorpayCheckout(orderData, message, checkoutMsg);
        return;
    }

    await placeOrder(orderData, message, checkoutMsg, {
        openWhatsApp: paymentMethod === "whatsapp"
    });
}

function paymentMethodLabel(value) {
    const labels = {
        razorpay: "Online Payment",
        whatsapp: "WhatsApp Confirmation",
        cod: "Cash on Delivery"
    };

    return labels[value] || value || "Not selected";
}

function buildCheckoutMessage(cart, details, pricing) {
    let message = "Hi, I want to order from SmartOrnaments.\n\n";

    message += "Customer Details\n";
    message += `Name: ${details.name}\nPhone: ${details.phone}\nPayment: ${paymentMethodLabel(details.paymentMethod)}\n`;
    message += `Address Type: ${details.addressType}\n`;
    message += `Flat / House No: ${details.flatNo}\nArea / Street: ${details.areaStreet}\n`;
    message += `City: ${details.city}\nState: ${details.state}\nDistrict: ${details.district || details.city}\n`;
    message += `Pincode: ${details.pincode}\n`;
    message += `Customization Name: ${details.customizationName || "Not provided"}\n`;
    message += `Customization Color: ${details.customizationColor || "Not selected"}\n`;
    message += `Customization Photo: ${details.customizationPhotoName || "Not uploaded"}\n`;
    message += `Customization Note: ${details.customization}\nDelivery Note: ${details.deliveryNote}\n\n`;
    message += "Items\n";

    cart.forEach((item, i) => {
        const qty = Number(item.qty || 1);
        const subtotal = Number(item.price || 0) * qty;
        const itemCustomization = cleanCustomizationData(item.customization);

        message += `${i + 1}. ${item.name} x ${qty} - ${money(subtotal)}\n`;
        if (hasCustomizationData(itemCustomization)) {
            message += `   Name: ${itemCustomization.customName || "Not provided"}\n`;
            message += `   Color: ${itemCustomization.color || "Not selected"}\n`;
            message += `   Photo: ${itemCustomization.photoName || "Not uploaded"}\n`;
        }
    });

    message += `\nSubtotal: ${money(pricing.subtotal)}`;
    message += `\nDiscount: ${money(pricing.discount)}`;
    message += `\nShipping: ${pricing.shipping ? money(pricing.shipping) : "Free"}`;
    message += `\nOffer: ${pricing.offer}`;
    message += `\nTotal: ${money(pricing.total)}`;

    return message;
}

async function startRazorpayCheckout(orderData, baseMessage, checkoutMsg) {
    if (!window.Razorpay) {
        if (checkoutMsg) checkoutMsg.innerText = "Razorpay checkout script is not loaded.";
        return;
    }

    try {
        if (checkoutMsg) checkoutMsg.innerText = "Opening secure payment...";
        const paymentOrder = await apiRequest("/api/payments/create-order", {
            method: "POST",
            body: JSON.stringify({ amount: orderData.total })
        });
        const razorpayOrder = paymentOrder.order || paymentOrder;
        const key = paymentOrder.key || paymentOrder.key_id;

        if (!key || !razorpayOrder.id) {
            throw new Error("Razorpay is not configured");
        }

        const options = {
            key,
            amount: razorpayOrder.amount || orderData.total * 100,
            currency: razorpayOrder.currency || "INR",
            name: "SmartOrnaments",
            description: "Order Payment",
            order_id: razorpayOrder.id,
            prefill: {
                name: orderData.customer.name,
                contact: orderData.customer.phone
            },
            handler: async function(response) {
                try {
                    if (checkoutMsg) checkoutMsg.innerText = "Payment successful. Saving order...";
                    let verified = false;

                    try {
                        const verifyData = await apiRequest("/api/payments/verify", {
                            method: "POST",
                            body: JSON.stringify(response)
                        });
                        verified = Boolean(verifyData.verified);
                    } catch (error) {
                        console.warn(error.message);
                    }

                    await placeOrder({
                        ...orderData,
                        paymentStatus: verified ? "Paid" : "Paid",
                        paymentProvider: "Razorpay",
                        paymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                        paymentVerified: verified
                    }, baseMessage, checkoutMsg, { openWhatsApp: false });
                } catch (error) {
                    if (checkoutMsg) checkoutMsg.innerText = "Payment completed, but order save failed: " + error.message;
                }
            },
            modal: {
                ondismiss: function() {
                    if (checkoutMsg) checkoutMsg.innerText = "Payment cancelled.";
                }
            },
            theme: {
                color: "#ff4d6d"
            }
        };

        new window.Razorpay(options).open();
    } catch (error) {
        if (checkoutMsg) checkoutMsg.innerText = error.message;
    }
}

async function placeOrder(orderData, message, checkoutMsg, options = {}) {
    if (useBackend) {
        try {
            if (checkoutMsg) checkoutMsg.innerText = "Saving order to database...";
            const order = await saveOrderToPhp(orderData);
            saveLocalOrderSnapshot(order);
            finishCheckout(order, message, orderData, options);
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                if (checkoutMsg) checkoutMsg.innerText = "Order not saved: " + error.message;
                return;
            }

            console.warn(error.message);
        }
    }

    if (useBackend) {
        try {
            if (checkoutMsg) checkoutMsg.innerText = "Saving order...";
            const data = await apiRequest("/api/orders", {
                method: "POST",
                body: JSON.stringify(orderData)
            });
            finishCheckout(data.order, message, orderData, options);
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                if (checkoutMsg) checkoutMsg.innerText = error.message + ". Please login before checkout.";
                return;
            }

            console.warn(error.message);
        }
    }

    const order = createLocalOrder(orderData);
    finishCheckout(order, message, orderData, options);
}

function finishCheckout(order, baseMessage, orderData = {}, options = {}) {
    const message = `${baseMessage}\nOrder ID: ${order.id}\nTotal: ${money(order.total)}\nOffer: ${order.offer || "No offer"}\nPayment Status: ${order.paymentStatus || orderData.paymentStatus || "Pending"}`;
    localStorage.setItem("lastOrderId", order.id);
    localStorage.setItem("lastOrderPaymentStatus", order.paymentStatus || orderData.paymentStatus || "Pending");
    if (options.openWhatsApp) {
        window.open(`https://wa.me/919344586609?text=${encodeURIComponent(message)}`, "_blank");
    }
    if (orderData.customer) saveCustomerAddress(orderData.customer);
    reduceLocalProductStock(getLocalCart());
    saveLocalCart([]);
    clearCoupon();
    sessionStorage.removeItem("pendingCheckout");
    sessionStorage.removeItem("pendingCheckoutDetails");
    orderPhotoStorage.checkout = null;
    updateCartCount();
    window.location.href = "success.html";
}

async function loadOrderSuccess() {
    const orderId = localStorage.getItem("lastOrderId");
    const orders = await getOrdersData();
    const order = orders.find(item => item.id === orderId) || orders[orders.length - 1];
    const status = document.getElementById("successStatus");

    if (!order) {
        document.getElementById("successOrderId").innerText = "No recent order";
        document.getElementById("successTotal").innerText = "Place an order to see confirmation details.";
        if (status) status.innerText = "";
        return;
    }

    document.getElementById("successOrderId").innerText = order.id || "Order";
    document.getElementById("successTotal").innerText = "Total: " + money(order.total);
    document.getElementById("successOffer").innerText = "Offer: " + (order.offer || "No offer");
    const payment = document.getElementById("successPayment");
    const delivery = document.getElementById("successDelivery");
    const title = document.getElementById("successTitle");
    const paymentStatus = order.paymentStatus || localStorage.getItem("lastOrderPaymentStatus") || "Pending";

    if (title) title.innerText = paymentStatus === "Paid" ? "Payment Successful" : "Order Placed";
    if (payment) payment.innerText = "Payment: " + paymentStatus;
    if (delivery) delivery.innerText = "Estimated delivery: 5-7 business days";
    if (status) status.innerText = "Status: " + normalizeOrderStatus(order.status);
}

async function getOrdersData() {
    const preferDatabaseRecords = localStorage.getItem("userRole") === "admin"
        || Boolean(document.getElementById("adminOrders"));

    if (useBackend) {
        if (preferDatabaseRecords) {
            try {
                const data = await phpOrderRequest("orders.php");
                localStorage.setItem("orders", JSON.stringify(data.orders));
                return data.orders;
            } catch (error) {
                console.warn(error.message);
            }
        }

        try {
            const data = await apiRequest("/api/orders");
            localStorage.setItem("orders", JSON.stringify(data.orders));
            return data.orders;
        } catch (error) {
            console.warn(error.message);
        }
    }

    return getLocalOrders();
}

async function loadOrders() {
    const orders = await getOrdersData();
    const container = document.getElementById("orderList");
    const isAdmin = localStorage.getItem("userRole") === "admin";

    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders yet</p>";
        return;
    }

    orders.forEach((order, index) => {
        let itemsHTML = "";

        (order.items || []).forEach(item => {
            const qty = Number(item.qty || 1);
            itemsHTML += `
                <p>- ${item.name} x ${qty} - ${money(item.price * qty)}</p>
                ${customizationDetailsHtml(item.customization)}
            `;
        });

        const status = normalizeOrderStatus(order.status);
        const adminActions = isAdmin
            ? `<button onclick="updateStatus(${index})">Update Status</button>
               <button onclick="deleteOrder(${index})">Delete</button>`
            : "";

        container.innerHTML += `
            <div class="card fade-in order-card">
                <h3>${order.id || "Order #" + (index + 1)}</h3>
                ${itemsHTML}
                <hr>
                <p><b>Total:</b> ${money(order.total)}</p>
                <p><b>Offer:</b> ${order.offer || "No offer"}</p>
                <p><b>Payment:</b> ${paymentMethodLabel(order.paymentMethod)} - ${order.paymentStatus || "Pending"}</p>
                ${customizationDetailsHtml({
                    customName: order.customer?.customizationName,
                    color: order.customer?.customizationColor,
                    photoName: order.customer?.customizationPhotoName,
                    photoData: order.customer?.customizationPhotoData
                })}
                <small>${order.date}</small>
                <p class="status ${getOrderStatusClass(status)}">Status: ${status}</p>
                ${buildOrderTrackingHtml(order)}
                <button onclick="reorder(${index})">Reorder</button>
                ${adminActions}
            </div>
       `;
    });
}

function getOrderStatusClass(status) {
    status = normalizeOrderStatus(status);
    if (status === "Processing") return "is-processing";
    if (status === "Packed") return "is-packed";
    if (status === "Shipped") return "is-shipped";
    if (status === "Delivered") return "is-delivered";
    return "is-processing";
}

function buildOrderTrackingHtml(order) {
    const status = normalizeOrderStatus(order.status);
    const activeIndex = orderStatuses.indexOf(status);
    const steps = [
        { key: "Processing", label: "Processing", time: order.processingAt || order.placedAt || order.date },
        { key: "Packed", label: "Packed", time: order.packedAt || order.makingAt || order.confirmedAt },
        { key: "Shipped", label: "Shipped", time: order.shippedAt },
        { key: "Delivered", label: "Delivered", time: order.deliveredAt }
    ].map((step, index) => ({
        ...step,
        done: index <= activeIndex
    }));
    const isActive = status !== "Processing";
    const note = isActive
        ? `Tracking ID: ${order.id || "Not provided"}`
        : "Tracking starts when your order is packed.";

    return `
        <div class="tracking-box ${isActive ? "is-active" : "is-waiting"}">
            <p><b>Tracking:</b> ${note}</p>
            <div class="tracking-steps">
                ${steps.map(step => `
                    <div class="tracking-step ${step.done ? "done" : ""}">
                        <span></span>
                        <div>
                            <b>${step.label}</b>
                            ${step.time ? `<small>${step.time}</small>` : ""}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function reorder(index) {
    const orders = getLocalOrders();
    if (!orders[index]) return;

    saveLocalCart(orders[index].items);
    alert("Items added to cart");
    window.location.href = "cart.html";
}

function orderRecordId(order) {
    return order?.dbId || order?.id || "";
}

async function deleteOrder(index) {
    const orders = await getOrdersData();
    const order = orders[index];
    if (!order) return;

    if (useBackend && orderRecordId(order)) {
        try {
            await phpOrderRequest("orders.php?id=" + encodeURIComponent(orderRecordId(order)), { method: "DELETE" });
            if (document.getElementById("adminOrders")) await loadAdminOrders();
            else await loadOrders();
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                alert(error.message);
                return;
            }

            console.warn(error.message);
        }

        try {
            await apiRequest("/api/orders/" + encodeURIComponent(order.id), { method: "DELETE" });
            if (document.getElementById("adminOrders")) await loadAdminOrders();
            else await loadOrders();
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                alert(error.message);
                return;
            }

            console.warn(error.message);
        }
    }

    orders.splice(index, 1);
    saveLocalOrders(orders);

    if (document.getElementById("adminOrders")) {
        loadAdminOrders();
    } else {
        loadOrders();
    }
}

window.addEventListener("scroll", () => {
    document.querySelectorAll(".fade-in").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("show");
        }
    });
});

async function updateStatus(index) {
    const orders = await getOrdersData();
    if (!orders[index]) return;

    const current = normalizeOrderStatus(orders[index].status);
    const next = nextOrderStatus(current);
    const shouldSendConfirmation = current === "Processing" && next === "Packed";
    const confirmationWindow = shouldSendConfirmation && getWhatsAppPhoneNumber(orders[index].customer?.phone)
        ? window.open("", "_blank")
        : null;

    if (useBackend && orderRecordId(orders[index])) {
        try {
            const data = await phpOrderRequest("orders.php?id=" + encodeURIComponent(orderRecordId(orders[index])), {
                method: "PATCH",
                body: JSON.stringify({ status: next })
            });
            const updatedOrder = data.order || applyOrderStatus({ ...orders[index] }, next);
            if (shouldSendConfirmation) openOrderConfirmationWhatsApp(updatedOrder, confirmationWindow);
            if (document.getElementById("adminOrders")) await loadAdminOrders();
            else await loadOrders();
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                if (confirmationWindow && !confirmationWindow.closed) confirmationWindow.close();
                alert(error.message);
                return;
            }

            console.warn(error.message);
        }

        try {
            const data = await apiRequest("/api/orders/" + encodeURIComponent(orders[index].id), {
                method: "PATCH",
                body: JSON.stringify({ status: next })
            });
            const updatedOrder = data.order || applyOrderStatus({ ...orders[index] }, next);
            if (shouldSendConfirmation) openOrderConfirmationWhatsApp(updatedOrder, confirmationWindow);
            if (document.getElementById("adminOrders")) await loadAdminOrders();
            else await loadOrders();
            return;
        } catch (error) {
            if (!isApiUnavailableError(error)) {
                if (confirmationWindow && !confirmationWindow.closed) confirmationWindow.close();
                alert(error.message);
                return;
            }

            console.warn(error.message);
        }
    }

    applyOrderStatus(orders[index], next);
    saveLocalOrders(orders);
    if (shouldSendConfirmation) openOrderConfirmationWhatsApp(orders[index], confirmationWindow);

    if (document.getElementById("adminOrders")) {
        loadAdminOrders();
    } else {
        loadOrders();
    }
}

async function openOrderConfirmationWhatsAppByIndex(index) {
    const popupWindow = window.open("", "_blank");
    const orders = await getOrdersData();
    const order = orders[index];

    if (!order) {
        if (popupWindow && !popupWindow.closed) popupWindow.close();
        return;
    }

    openOrderConfirmationWhatsApp(order, popupWindow);
}

function checkAdmin() {
    const user = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");
    const isAdminUser = isAdminLoginId(user);

    if (role === "admin" || isAdminUser) {
        if (isAdminUser && role !== "admin") {
            localStorage.setItem("userRole", "admin");
        }
        return true;
    }

    if (!user) {
        requireLogin("admin.html");
        return;
    }

    alert("Admin access required. Please login with smartornaments.shop@gmail.com / admin123.");
    window.location.href = "login.html?redirect=admin.html";
    return false;
}

async function initAdminPage() {
    if (!checkAdmin()) return;

    showUser();
    await loadAdminNotifications();
    await loadAdminProducts();
    await loadAdminOrders();
    await loadAdminUsers();
    updateCartCount();
}

let currentOrderFilter = "all";

function setOrderFilter(status) {
    currentOrderFilter = status;

    document.querySelectorAll(".order-filters button").forEach(button => {
        button.classList.toggle("active", button.innerText === status || (status === "all" && button.innerText === "All"));
    });

    loadAdminOrders();
}

async function loadAdminOrders() {
    const orders = await getOrdersData();
    const container = document.getElementById("adminOrders");
    const allRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const visibleOrders = currentOrderFilter === "all"
        ? orders
        : orders.filter(order => normalizeOrderStatus(order.status) === currentOrderFilter);
    const totalOrders = document.getElementById("totalOrders");
    const totalRevenue = document.getElementById("totalRevenue");
    const adminBestSeller = document.getElementById("adminBestSeller");
    const bestSeller = getBestSellerFromOrders(orders, getProducts());

    container.innerHTML = "";
    if (totalOrders) totalOrders.innerText = orders.length;
    if (totalRevenue) totalRevenue.innerText = money(allRevenue);
    if (adminBestSeller) {
        adminBestSeller.innerText = bestSeller
            ? `${bestSeller.name} (${bestSeller.quantity})`
            : "No orders yet";
    }

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders yet</p>";
        return;
    }

    if (visibleOrders.length === 0) {
        container.innerHTML = "<p>No orders for this status.</p>";
    }

    visibleOrders.forEach((order) => {
        const index = orders.indexOf(order);
        let itemsHTML = "";
        const status = normalizeOrderStatus(order.status);
        const confirmationAction = status !== "Processing"
            ? `<button onclick="openOrderConfirmationWhatsAppByIndex(${index})">WhatsApp Update</button>`
            : "";

        (order.items || []).forEach(item => {
            const qty = Number(item.qty || 1);
            itemsHTML += `
                <p>- ${item.name} x ${qty} - ${money(item.price * qty)}</p>
                ${customizationDetailsHtml(item.customization)}
            `;
        });

        container.innerHTML += `
            <div class="card fade-in">
                <h3>${order.id || "Order #" + (index + 1)}</h3>
                <p><b>Customer:</b> ${order.customer?.name || "Customer"}</p>
                <p><b>Phone:</b> ${order.customer?.phone || "Not provided"}</p>
                <p><b>Address Type:</b> ${order.customer?.addressType || "Not provided"}</p>
                <p><b>Flat / House No:</b> ${order.customer?.flatNo || "Not provided"}</p>
                <p><b>Area / Street:</b> ${order.customer?.areaStreet || order.customer?.buildingStreet || order.customer?.address || "Not provided"}</p>
                <p><b>State:</b> ${order.customer?.state || "Not provided"}</p>
                <p><b>District:</b> ${order.customer?.district || "Not provided"}</p>
                <p><b>Pincode:</b> ${order.customer?.pincode || "Not provided"}</p>
                <p><b>Customization Name:</b> ${order.customer?.customizationName || "Not provided"}</p>
                <p><b>Customization Color:</b> ${order.customer?.customizationColor || "Not selected"}</p>
                <p><b>Customization Photo:</b> ${order.customer?.customizationPhotoName || "Not uploaded"}</p>
                ${order.customer?.customizationPhotoData ? `<div class="customization-details"><img src="${order.customer.customizationPhotoData}" alt="Customization photo"></div>` : ""}
                <p><b>Customization Note:</b> ${order.customer?.customization || "None"}</p>
                <p><b>Delivery Note:</b> ${order.customer?.deliveryNote || "None"}</p>
                ${itemsHTML}
                <hr>
                <p><b>Total:</b> ${money(order.total)}</p>
                <p><b>Offer:</b> ${order.offer || "No offer"}</p>
                <p><b>Payment:</b> ${paymentMethodLabel(order.paymentMethod)} - ${order.paymentStatus || "Pending"}</p>
                <p class="status ${getOrderStatusClass(status)}">Status: ${status}</p>
                ${status === "Packed" ? `<p><b>Packed:</b> ${order.packedAt || order.makingAt || order.confirmedAt || "Just now"}</p>` : ""}
                ${status === "Shipped" ? `<p><b>Shipped:</b> ${order.shippedAt || "Just now"}</p>` : ""}
                ${status === "Delivered" ? `<p><b>Delivered:</b> ${order.deliveredAt || "Completed"}</p>` : ""}
                <small>${order.date}</small>
                <br><br>
                <button onclick="updateStatus(${index})">Change Status</button>
                ${confirmationAction}
                <button onclick="deleteOrder(${index})">Delete</button>
            </div>
        `;
    });

}

async function logout(event) {
    if (event) event.preventDefault();

    if (useBackend) {
        try {
            await apiRequest("/api/logout", { method: "POST" });
        } catch (error) {
            console.warn(error.message);
        }
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
}
