// ============================================================
// data.js — All mock property, school, crime and commute data
// Replace with real API calls in production
// ============================================================

const DB = {
  props: {
    whitefield: [
      { id:"WF001", name:"Prestige Lakeside Habitat",    addr:"Whitefield Main Road",          price:7500000, br:2, sqft:1100, am:["Gym","Pool","Park","24x7 Security"], age:3, rera:true },
      { id:"WF002", name:"Brigade Cosmopolis",           addr:"ITPL Main Road, Whitefield",     price:6800000, br:2, sqft:980,  am:["Gym","Clubhouse","Play Area"],       age:5, rera:true },
      { id:"WF003", name:"Sobha Silicon Oasis",          addr:"Hosa Road, Whitefield",          price:8200000, br:3, sqft:1400, am:["Pool","Tennis","Park","Concierge"],  age:2, rera:true },
      { id:"WF004", name:"Godrej Woodsman Estate",       addr:"Hope Farm Junction, Whitefield", price:7200000, br:2, sqft:1050, am:["Gym","Park","Jogging Track"],        age:4, rera:true },
      { id:"WF005", name:"Purva Windermere",             addr:"Pallikaranai, Whitefield",       price:5900000, br:2, sqft:920,  am:["Clubhouse","Park"],                  age:7, rera:true },
    ],
    koramangala: [
      { id:"KR001", name:"Salarpuria Serenity",          addr:"5th Block, Koramangala",         price:9200000, br:2, sqft:1200, am:["Gym","Pool","Concierge","Rooftop"],  age:4, rera:true  },
      { id:"KR002", name:"Century Ethos",                addr:"6th Block, Koramangala",         price:8800000, br:2, sqft:1150, am:["Gym","Park","Clubhouse"],             age:3, rera:true  },
      { id:"KR003", name:"Mantri Espana",                addr:"7th Block, Koramangala",         price:7600000, br:2, sqft:1000, am:["Pool","Gym"],                         age:6, rera:false },
    ],
    hebbal: [
      { id:"HB001", name:"Embassy Lake Terraces",        addr:"Hebbal Outer Ring Road",         price:11500000, br:3, sqft:1800, am:["Pool","Gym","Lake View","Spa","Tennis"], age:2, rera:true },
      { id:"HB002", name:"Prestige Misty Waters",        addr:"Hebbal, Bangalore",              price:8900000,  br:2, sqft:1250, am:["Pool","Gym","Park"],                     age:3, rera:true },
    ],
    hsr: [
      { id:"HS001", name:"Adarsh Palm Retreat",          addr:"HSR Layout Sector 2",            price:7800000, br:2, sqft:1100, am:["Park","Gym","Pool"],                  age:5, rera:true },
      { id:"HS002", name:"Sobha Dream Acres",            addr:"HSR Layout Sector 5",            price:6500000, br:2, sqft:980,  am:["Gym","Clubhouse","Badminton"],        age:4, rera:true },
      { id:"HS003", name:"Total Env · Quiet Earth",      addr:"HSR Layout Sector 7",            price:9400000, br:2, sqft:1350, am:["Garden","Yoga Deck","Pool","Pet-Friendly"], age:3, rera:true },
    ],
  },

  commute: {
    WF001: { "mg road":38, "electronic city":55, "whitefield":8,  "marathahalli":15 },
    WF002: { "mg road":35, "electronic city":52, "whitefield":12, "marathahalli":18 },
    WF003: { "mg road":42, "electronic city":60, "whitefield":10, "marathahalli":20 },
    WF004: { "mg road":36, "electronic city":58, "whitefield":6,  "marathahalli":16 },
    WF005: { "mg road":45, "electronic city":62, "whitefield":14, "marathahalli":22 },
    KR001: { "mg road":20, "electronic city":30, "koramangala":5, "whitefield":40  },
    KR002: { "mg road":22, "electronic city":28, "koramangala":5, "whitefield":42  },
    KR003: { "mg road":25, "electronic city":25, "koramangala":5, "whitefield":45  },
    HB001: { "mg road":25, "manyata":10,         "electronic city":55, "whitefield":50 },
    HB002: { "mg road":28, "manyata":12,         "electronic city":52, "whitefield":52 },
    HS001: { "mg road":30, "electronic city":22, "koramangala":12, "whitefield":45 },
    HS002: { "mg road":28, "electronic city":20, "koramangala":10, "whitefield":47 },
    HS003: { "mg road":35, "electronic city":25, "koramangala":8,  "whitefield":50 },
  },

  schools: {
    whitefield:  { r:8.2, top:["Vydehi School of Excellence (9.1)","New Horizon Gurukul (8.5)","Inventure Academy (8.4)"] },
    koramangala: { r:9.0, top:["DPS South (9.5)","Inventure Academy (9.2)","National Public School (9.0)"] },
    hebbal:      { r:7.8, top:["Ryan International (8.2)","Vidya Niketan (7.9)","Greenwood High (7.6)"] },
    hsr:         { r:8.7, top:["Greenwood High (9.3)","National Public School (8.8)","Orchids International (8.6)"] },
  },

  crime: {
    whitefield:  { safety:7.2, index:32, trend:"Decreasing", note:"Vehicle theft is the main concern, improving with more CCTV coverage." },
    koramangala: { safety:6.5, index:41, trend:"Stable",     note:"Vibrant nightlife area. Minor street crime; violent incidents are rare." },
    hebbal:      { safety:7.8, index:28, trend:"Decreasing", note:"One of the safer areas in North Bangalore with active policing." },
    hsr:         { safety:8.1, index:25, trend:"Decreasing", note:"Best-planned locality in Bangalore. Strong RWA and dedicated policing." },
  }
};
