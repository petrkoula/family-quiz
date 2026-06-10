# Photo Quiz - Serverový režim s týmovými odpověďmi

## 🎯 Co to je?

Rozšířená verze Photo Quiz, která umožňuje týmům odpovídat na otázky přes své mobilní telefony v reálném čase. Odpovědi se sbírají přes QR kód a automaticky bodují.

## 📋 Požadavky

- **Node.js** (verze 14 nebo novější)
  - Stáhněte z: https://nodejs.org/
  - Doporučená verze: LTS (Long Term Support)

## 🚀 Instalace a spuštění

### Krok 1: Instalace závislostí

Spusťte v této složce:

```
install.bat
```

Tento skript nainstaluje potřebné Node.js balíčky (Express, Socket.io, QRCode).

### Krok 2: Spuštění serveru

```
start-server.bat
```

Server se spustí na portu 3000. V konzoli uvidíte:
- Lokální URL
- Síťovou IP adresu (pro připojení týmů)

### Krok 3: Otevření aplikace

Po spuštění serveru se automaticky otevřou 3 URL:

1. **Prezentace** - `http://localhost:3000/index.html`
   - Hlavní obrazovka s fotkami a otázkami
   - Zobrazuje QR kód v pravém horním rohu
   - Ovládání stejné jako dříve

2. **Admin Panel** - `http://localhost:3000/admin.html`
   - Sledování odpovědí v reálném čase
   - Žebříček týmů
   - Export výsledků do CSV

3. **Týmy** - `http://192.168.1.XXX:3000/team.html`
   - Mobilní rozhraní pro týmy
   - Přístupné naskenováním QR kódu

## 📱 Jak to funguje?

### Pro prezentujícího:

1. Spusťte server (`start-server.bat`)
2. Otevřete prezentaci (`http://localhost:3000/index.html`)
3. Otevřete admin panel na druhé obrazovce
4. QR kód se zobrazí v pravém horním rohu prezentace

### Pro týmy:

1. Naskenujte QR kód telefonem
2. Zadejte jméno týmu
3. Čekejte, až se objeví otázka
4. Vyberte odpověď a odešlete
5. Vaše skóre se automaticky aktualizuje

### Průběh hry:

1. **Prezentující zobrazí fotku** (celá obrazovka)
2. **Stiskne mezerník** → zobrazí se otázka
3. **Týmy vidí otázku** na svých telefonech a odpovídají
4. **Admin panel** ukazuje, kdo už odpověděl
5. **Prezentující stiskne A** → zobrazí se správná odpověď
6. **Body se automaticky přičtou** týmům se správnou odpovědí
7. **Šipka dolů** → další otázka u stejné fotky
8. **Mezerník** → skryje otázky
9. **Šipka vpravo** → další fotka

## 🎮 Ovládání

### Prezentace:
- **Mezerník** - zobrazit/skrýt otázky
- **← →** - předchozí/další fotka (jen když jsou otázky skryté)
- **↑ ↓** - předchozí/další otázka
- **A** - zobrazit správnou odpověď + přičíst body
- **F** - celá obrazovka

### Team rozhraní:
- Automaticky synchronizováno s prezentací
- Jednoduché tlačítka pro výběr odpovědi

## 📊 Admin Panel funkce

- **Real-time žebříček týmů** - automaticky seřazený podle bodů
- **Odpovědi na aktuální otázku** - vidíte, kdo už odpověděl
- **Historie všech odpovědí** - kompletní přehled
- **Export do CSV** - pro pozdější analýzu

## 🔧 Technické detaily

### Architektura:
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│ Prezentace  │◄───────►│ Node.js      │◄───────►│   Týmy      │
│ (index.html)│ Socket  │ Server       │ Socket  │ (team.html) │
└─────────────┘         └──────────────┘         └─────────────┘
                              ▲
                              │ Socket
                              ▼
                        ┌──────────────┐
                        │ Admin Panel  │
                        │ (admin.html) │
                        └──────────────┘
```

### Komunikace:
- **WebSocket (Socket.io)** pro real-time komunikaci
- Automatická synchronizace stavu hry
- Okamžité přenos odpovědí a bodování

### Bodování:
- Automatické přičítání bodů za správné odpovědi
- Bod se přičte okamžitě po stisku **A** (reveal answer)
- Export výsledků do CSV formátu

## 🌐 Síťové nastavení

### Lokální síť (WiFi):
1. Ujistěte se, že počítač i telefony jsou na stejné WiFi
2. Windows Firewall možná bude blokovat port 3000
3. Pokud týmy nemohou přistupovat:
   - Povolit port 3000 ve firewallu
   - Nebo dočasně vypnout firewall

### Zjištění IP adresy:
Server automaticky zobrazí IP adresu při spuštění:
```
Network:  http://192.168.1.105:3000
```

Nebo ručně:
```
ipconfig
```
Hledejte IPv4 Address.

## 🐛 Řešení problémů

### Server se nespustí
- Zkontrolujte, že Node.js je nainstalovaný: `node --version`
- Spusťte znovu `install.bat`

### Týmy se nemohou připojit
- Zkontrolujte firewall
- Ujistěte se, že jsou na stejné WiFi
- Zkuste vypnout antivirus dočasně

### QR kód se nezobrazuje
- Ujistěte se, že používáte serverový režim (start-server.bat)
- Zkontrolujte konzoli prohlížeče (F12) pro chyby

### Odpovědi se neposílají
- Obnovte stránku týmu (reload)
- Zkontrolujte admin panel, zda jsou týmy připojené

## 📝 Standalone režim

Aplikace funguje i **bez serveru** (původní režim):
- Jednoduše otevřete `index.html` přímo v prohlížeči
- Nebude QR kód, team odpovědi, ani admin panel
- Jen prezentace s otázkami

## 💾 Export dat

Admin panel umožňuje exportovat:
- **CSV soubor** s pořadím týmů a skóre
- Formát: `Pořadí, Tým, Skóre`
- Vhodné pro další zpracování v Excelu

## 🎨 Přizpůsobení

### Změna portu:
V `server.js` změňte:
```javascript
const PORT = 3000;  // změňte na jiný port
```

### Styling:
- `team.html` - mobilní rozhraní pro týmy
- `admin.html` - admin panel
- `styles.css` - prezentace

## 📞 Podpora

V případě problémů zkontrolujte:
1. Node.js verzi: `node --version`
2. Konzoli serveru (příkazový řádek)
3. Browser konzoli (F12)

---

**Vytvořeno pro interaktivní prezentace s týmovou účastí! 🎯**
