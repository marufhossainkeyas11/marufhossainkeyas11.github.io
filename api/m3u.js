// api/m3u.js  — Vercel Serverless Function
// Fetches token for each channel from iptvidn.com and returns a full M3U playlist

const MAIN_URL   = "http://iptvidn.com/";
const LIVE_SERVER = "http://103.89.248.30:8082/";
const TOKEN_RE   = /token=[^&\s"']+/;

// ── channel list parsed from iptvidn.com HTML ──────────────────────────────
const CHANNELS = [
  // [streamId, name, imgFile, category]
  ["1LIVE","Live 1","Live1.jpeg","Live Sports"],
  ["2LIVE","Live 2","Live2.jpeg","Live Sports"],
  ["LIVE-CRICKET","Live Cricket","LIVE-CRICKET.jpg","Live Sports"],
  ["LIVE-CRICKET-1","Live Cricket 1","LIVE-CRICKET.jpg","Live Sports"],
  ["LIVE-FOOTBALL","Live Football","LIVE-FOOTBALL.jpg","Live Sports"],
  ["LIVE-FOOTBALL-1","Live Football 1","LIVE-FOOTBALL.jpg","Live Sports"],
  ["LIVE-FOOTBALL-2","Live Football 2","LIVE-FOOTBALL.jpg","Live Sports"],
  ["STAR-SPORTS-1","Star Sports 1","starsports1.jpg","Sports"],
  ["STAR-SPORTS-2","Star Sports 2","starsports2.jpg","Sports"],
  ["T-SPORTS","T Sports","tsports.jpg","Sports"],
  ["GAZI-TV","Gazi TV","gazi.jpg","Sports"],
  ["PTV","PTV Sports","ptvsports.jpg","Sports"],
  ["Afgan-Sports","Afghan Sports","AFGAN.jpg","Sports"],
  ["SUPERSPORTS-CRICKET","SuperSport Cricket","Supersportscricket.jpeg","Sports"],
  ["SUPERSPORTS-FOOTBALL","SuperSport Football","Supersportsfootball.jpeg","Sports"],
  ["SUPERSPORTS-LALIGA","SuperSport La Liga","laliga.jpg","Sports"],
  ["SUPERSPORTS-PREMIER-LEAGUE","SuperSport Premier League","premer league.jpg","Sports"],
  ["Sportv","Sport TV","sportv.jpeg","Sports"],
  ["SSC1","SSC","SSC.jpg","Sports"],
  ["GEO-SPORTS","Geo Super","geosuper.jpg","Sports"],
  ["MUTV","MUTV","mutv.jpg","Sports"],
  ["Bein-hd","beIN Sports HD","bein1.jpg","Sports"],
  ["BEIN-SPORTS-2","beIN Sports 2","bein2.jpg","Sports"],
  ["BEIN-SPORTS-3","beIN Sports 3","bein3.jpg","Sports"],
  ["Bein-Sports-4","beIN Sports 4","bein4.jpg","Sports"],
  ["Ten-Cricket-HD","Ten Cricket HD","tencricket.jpg","Sports"],
  ["TNT-Sports-1","TNT Sports 1","tntsports1.jpeg","Sports"],
  ["TNT-Sports-2","TNT Sports 2","tntsports2.jpeg","Sports"],
  ["TNT-Sports-3","TNT Sports 3","tntsports3.jpeg","Sports"],
  ["Uk-TNT-4","TNT Sports 4","tnt sports4.jpg","Sports"],
  ["FOX-SPORTS","Fox Sports","fox.jpg","Sports"],
  ["FOX-SPORTS1","Fox Sports 1","foxsports1.jpg","Sports"],
  ["willow","Willow HD","willowhd.jpg","Sports"],
  ["Sky-Sports-Main-Event","Sky Sports Main Event","skymainevent.jpg","Sports"],
  ["Sky-Sports-Cricket","Sky Sports Cricket","skycricket.jpg","Sports"],
  ["SKY-Sports-Football","Sky Sports Football","skyfootball.jpg","Sports"],
  ["Sky-Sports-premier-League","Sky Sports Premier League","skypremierleague.jpg","Sports"],
  ["Star-sports-select-1","Star Sports Select 1","starselect1.jpg","Sports"],
  ["Star-sports-select-2","Star Sports Select 2","starselect2.jpg","Sports"],
  ["Sony-TEN-1","Sony TEN 1","sonyten-1.png","Sports"],
  ["sony-TEN-2","Sony TEN 2","sonyten2.png","Sports"],
  ["sony-ten3","Sony TEN 3 HD","ten3hd.jpg","Sports"],
  ["Sony-TEN-5","Sony TEN 5","sonyten5.png","Sports"],
  ["SPORTS-18","Sports 18","Sports18-S1.jpg","Sports"],
  ["Eurosports","Eurosport","eurosports1.jpg","Sports"],
  ["Star-sport-3","Star Sports 3","starsports3.jpg","Sports"],
  ["A-SPORTS","A Sports","a-sports.jpg","Sports"],
  ["DUBAI-SPORTS-2","Dubai Sports 2","dubai sports.jpg","Sports"],
  ["dubai-sports-3","Dubai Sports 3","dubai sports.jpg","Sports"],
  ["AND-XPLORE","AND Xplore","band sports.jpg","Sports"],
  ["ESPN-1","ESPN HD","espnhd.jpg","Sports"],
  ["BBC-NEWS","BBC News","bbcnews.jpg","News"],
  ["BBC-Earth","BBC Earth HD","bbcearthhd.jpg","News"],
  ["CNN","CNN","cnnnews.jpg","News"],
  ["Jamuna","Jamuna TV","jamunatv.jpg","News"],
  ["Chanal24","Channel 24","channel24.jpg","News"],
  ["ATN-NEWS","ATN News","atnnews.jpg","News"],
  ["NEWS-24","News 24","news24.jpg","News"],
  ["SOMOY_TV","Somoy TV","somoy.jpg","News"],
  ["DBC-NEWS","DBC News","dbc.jpg","News"],
  ["INDEPENDENT-NEWS","Independent TV","independenttv.jpg","News"],
  ["71-TV","71 TV","ekattortv.jpg","News"],
  ["JALSHA-MOVIES","Jalsha Movies","jalshamovies.jpg","Bangla"],
  ["Star_jalsha","Star Jalsha","starjalsha.jpg","Bangla"],
  ["zee-bangla","Zee Bangla HD","zeebanglahd.jpg","Bangla"],
  ["GAZI-TV","Gazi TV","gazi.jpg","Bangla"],
  ["RONGEEN-TV","Rongeen TV","rongeen.jpg","Bangla"],
  ["GLOBAL-TV","Global TV","globaltv.jpg","Bangla"],
  ["DESH","Desh TV","deshtv.jpg","Bangla"],
  ["ATN-BANGLA","ATN Bangla","atnbangla.jpg","Bangla"],
  ["CHANNAL-I","Channel i","channeli.jpg","Bangla"],
  ["NTV","NTV","ntv.jpg","Bangla"],
  ["RTV","RTV","rtv.jpg","Bangla"],
  ["NEXUS-TV","Nexus TV","nexustv.jpg","Bangla"],
  ["Akash-aat","Akash Aat","akashaath.jpg","Bangla"],
  ["ENTER-10-BANGLA","Enter 10 Bangla","enterr10.jpg","Bangla"],
  ["BIJOY-TV","Bijoy TV","bijoytv.jpg","Bangla"],
  ["MOHONA-TV","Mohona TV","mohonatv.jpg","Bangla"],
  ["DURONTO-TV","Duronto TV","duronto.jpg","Bangla"],
  ["ANANDA-TV","Ananda TV","anandotv.jpg","Bangla"],
  ["MY-TV","My TV","mytv.jpg","Bangla"],
  ["NAGORIK-TV","Nagorik TV","nagorik.jpg","Bangla"],
  ["MAASRANGA-TV","Maasranga TV","maasranga.jpg","Bangla"],
  ["CHANNEL-9","Channel 9","channel9.jpg","Bangla"],
  ["EKHON-TV","Ekhon TV","ekhon.jpg","Bangla"],
  ["EKUSHEY-TV","Ekushey TV","ekushey.jpg","Bangla"],
  ["madani-channel-bangla","Madani Channel Bangla","madanichannel.jpg","Bangla"],
  ["RUPOSHI-BANGLA","Ruposhi Bangla","Rupasi bangla.jpeg","Bangla"],
  ["Sony-Aath","Sony Aath","sonyaath.jpg","Bangla"],
  ["ZEE-24-GHANTA","Zee 24 Ghanta","zee 24.jpeg","Bangla"],
  ["AND-TV","AND TV","and tv.jpeg","Movies"],
  ["Colors-Bangla","Colors Bangla","colorsbangla.jpg","Movies"],
  ["COLORS-BANGLA-CINEMA","Colors Bangla Cinema","colar-bangla-cinema.jpg","Movies"],
  ["ZEE-BANGLA-CINEMA","Zee Bangla Cinema","zeebanglacinema.jpg","Movies"],
  ["Zee-Cinema-HD","Zee Cinema HD","zee cinema.jpeg","Movies"],
  ["zee-tv-hd","Zee TV HD","zee tv.jpeg","Movies"],
  ["ZEE-ANMOL-CHANEMA","Zee Anmol Cinema","zeeanmol.jpg","Movies"],
  ["HBO","HBO HD","hbohd.jpg","Movies"],
  ["B4U-MOVIES","B4U Movies","b4umovies.jpg","Movies"],
  ["my-time","My Time","my time.jpg","Movies"],
  ["AXN","AXN","axn.jpg","Movies"],
  ["STAR-PLUS","Star Plus HD","starplushd.jpg","Hindi"],
  ["STAR-MOVIES-SELECT","Star Movies Select HD","starmovieshd.jpg","Movies"],
  ["star-gold","Star Gold","stargold.jpg","Movies"],
  ["star-gold-2","Star Gold 2","stargold2.jpg","Movies"],
  ["STAR-GOLD-THRILLS","Star Gold Thrills","stargoldthrills.jpg","Movies"],
  ["STAR-GOLD-ROMANCE","Star Gold Romance","stargoldromance.jpg","Movies"],
  ["STAR-BHARAT","Star Bharat","starbharat.jpg","Hindi"],
  ["SONY-TV","Sony TV","sonytv.jpg","Hindi"],
  ["HUM-TV","HUM TV HD","humtvhd.jpg","Hindi"],
  ["Hum-masala","HUM Masala","hum masala.jpg","Hindi"],
  ["Hum-Sitarey","HUM Sitarey","hum sitarey.jpg","Hindi"],
  ["SONY-MAX","Sony MAX HD","sonymaxhd.jpg","Movies"],
  ["sony-max2","Sony MAX 2","sony max2.jpeg","Movies"],
  ["SONY-SAB","Sony SAB HD","sonysabhd.jpg","Hindi"],
  ["sony-WAH","Sony WAH","sony wah.jpeg","Hindi"],
  ["Colors-HD","Colors HD","colorshd.jpg","Hindi"],
  ["SONY-YAY","Sony YAY!","sonyyay.jpg","Kids"],
  ["SONY-KAL","Sony KAL","sony kal.jpeg","Hindi"],
  ["sony-pix-hd","Sony PIX HD","sonypix.jpg","Movies"],
  ["mtv-beats","MTV Beats","mtvbeats.jpg","Movies"],
  ["AND-FLIX","AND FLIX HD","andflixhd.jpg","Movies"],
  ["and-picture-HD","AND Pictures HD","andpictureshd.jpg","Movies"],
  ["animalplanent","Animal Planet","animalplanetnew.jpg","Documentary"],
  ["National-geo-graphy-bangla","National Geographic Bangla","nationalgeo.jpg","Documentary"],
  ["nat-geo-wild","Nat Geo Wild HD","natgeowildhd.jpg","Documentary"],
  ["DISCOVERY-HD","Discovery HD","discoveryhd.jpg","Documentary"],
  ["travel-xp","Travel XP HD","travelxphd.jpg","Documentary"],
  ["tlc-hd","TLC HD","tlchd.jpg","Documentary"],
  ["REDBOL-TV","Red Bull TV","red bull.jpg","Documentary"],
  ["DMAX","DMAX","dmax.jpg","Documentary"],
  ["LOVE-NATURE","Love Nature","love nature.jpg","Documentary"],
  ["Wild-Earth","Wild Earth","wild earth.jpg","Documentary"],
  ["Discovery-Science","Discovery Science","discoveryscience.jpg","Documentary"],
  ["Discovery-Turbo","Discovery Turbo","discovery turbo.jpg","Documentary"],
  ["Investigation-Discovery","Investigation Discovery","investigation discovery.jpg","Documentary"],
  ["DISCOVERY-BANGLA","Discovery Bangla","discoverybangla.jpg","Documentary"],
  ["DISNEY-HINDI","Disney Channel Hindi","disneychannel.jpg","Kids"],
  ["DISCOVERY-KIDS","Discovery Kids","discoverykids.jpg","Kids"],
  ["cn","Cartoon Network","cartoonnetwork.jpg","Kids"],
  ["POGO","POGO","pogo.jpg","Kids"],
  ["MN-Plus","MN+ HD","mnplushd.jpg","Movies"],
  ["GAANBANGLA-TV","Gaan Bangla","gaanbangla.jpg","Music"],
  ["SANGEET-BANGLA","Sangeet Bangla","Sangeetbangla.jpg","Music"],
  ["9XM","9XM","9xm.jpg","Music"],
  ["9X-JALWA","9X Jalwa","9xjalwa.jpg","Music"],
  ["B4U-MUSIC","B4U Music","b4umusic.jpg","Music"],
  ["xite-music","Xite Music","Xitemusic.jpeg","Music"],
];

async function fetchToken(streamId) {
  const url = `${MAIN_URL}play.php?stream=${streamId}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": MAIN_URL,
      },
      redirect: "follow",
    });
    const text = await res.text();
    const match = TOKEN_RE.exec(text);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Optional: filter by single channel  ?stream=NTV
  const single = req.query.stream || null;
  const targets = single
    ? CHANNELS.filter(([id]) => id.toLowerCase() === single.toLowerCase())
    : CHANNELS;

  const lines = ["#EXTM3U"];

  // Fetch tokens in parallel (max 10 at a time to be polite)
  const chunkSize = 10;
  for (let i = 0; i < targets.length; i += chunkSize) {
    const chunk = targets.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async ([streamId, name, imgFile, category]) => {
        const logoUrl = `${MAIN_URL}assets/images/${imgFile}`;
        const token   = await fetchToken(streamId);
        if (!token) return;
        const m3u8 = `${LIVE_SERVER}${streamId}/index.fmp4.m3u8?${token}`;
        lines.push(
          `#EXTINF:-1 tvg-id="${streamId}" tvg-name="${name}" tvg-logo="${logoUrl}" group-title="${category}",${name}`,
          m3u8
        );
      })
    );
  }

  res.setHeader("Content-Type", "audio/mpegurl");
  res.setHeader("Content-Disposition", 'attachment; filename="iptvidn.m3u"');
  res.status(200).send(lines.join("\n") + "\n");
}
