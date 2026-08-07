# Sprint: widok gry Car Clicker

## Cel sprintu

Przygotowanie pierwszej wersji widoku gry clickerowej opartej o samochod i tuning. Gracz klika w samochod, zarabia walute, kupuje ulepszenia i stopniowo zwieksza zarobek za klikniecie oraz zarobek pasywny.

Widok ma byc grywalnym MVP, nie tylko makieta. Po sprincie uzytkownik powinien moc wejsc na ekran gry, klikac samochod, widziec aktualny stan waluty, kupowac ulepszenia i czuc postep.

## Zakres MVP

- Nowy ekran gry w aplikacji mobilnej.
- Centralny samochod jako glowny obiekt do klikania.
- Waluta gry, np. `monety`, `cash` albo `garage points`.
- Zarobek za klikniecie: `per click`.
- Zarobek pasywny: `per second`.
- Lista ulepszen z cena, poziomem i efektem.
- Prosta wizualna reakcja po kliknieciu.
- Blokada zakupu, gdy gracz ma za malo waluty.
- Lokalny stan gry na czas sesji.
- Prosty zapis lokalny stanu gry, jesli projekt ma juz gotowy mechanizm storage.

## Glowne mechaniki

### Klikanie samochodu

- Tap w samochod dodaje walute.
- Kwota zalezy od aktualnego `per click`.
- Po kliknieciu widac krotki feedback:
  - animacja samochodu,
  - liczba zarobionych monet nad autem,
  - delikatny blysk, wibracja albo dzwiek w pozniejszym etapie.

### Ulepszenia per click

Ulepszenia zwiekszajace zarobek z jednego klikniecia:

- Lepsze opony: stabilny, tani upgrade startowy.
- Chip tuning: sredni koszt, mocny wzrost `per click`.
- Turbo: drozsze ulepszenie z wyraznym skokiem zarobku.
- Sportowy wydech: umiarkowany wzrost i element wizualny.
- Lzejsza karoseria: pozniejszy upgrade dla szybszego progresu.

### Ulepszenia pasywne

Ulepszenia zarabiajace automatycznie:

- Mechanik w garazu: generuje staly dochod co sekunde.
- Myjnia samochodowa: maly, stabilny pasywny dochod.
- Warsztat tuningowy: drozszy, ale mocniejszy pasywny dochod.
- Ekipa pit stop: szybsze generowanie waluty.
- Dealer aut: pozna mechanika, wysoki pasywny dochod.

### Sciezki rozwoju auta

Gracz powinien miec kilka opcji rozwoju, zamiast jednej liniowej listy:

- Moc: silnik, turbo, chip tuning, paliwo premium.
- Wyglad: lakier, felgi, body kit, neon.
- Garaz: mechanicy, narzedzia, warsztat, dealer.
- Automatyzacja: pasywny dochod, bonus offline, mnozniki czasowe.

W MVP wystarcza dwie sciezki: `Moc` i `Garaz`. Pozostale mozna dodac po sprawdzeniu, czy podstawowa petla gry jest przyjemna.

## Proponowany model ekonomii

### Stan gry

```ts
type CarClickerState = {
  cash: number;
  perClick: number;
  perSecond: number;
  upgrades: Record<string, number>;
  selectedCarTier: number;
};
```

### Ulepszenie

```ts
type Upgrade = {
  id: string;
  name: string;
  category: 'power' | 'garage' | 'style' | 'automation';
  baseCost: number;
  costMultiplier: number;
  perClickBonus?: number;
  perSecondBonus?: number;
  maxLevel?: number;
};
```

### Przykladowe wartosci startowe

| Ulepszenie | Kategoria | Koszt bazowy | Efekt | Mnoznik ceny |
| --- | --- | ---: | --- | ---: |
| Lepsze opony | Moc | 25 | +1 per click | 1.18 |
| Chip tuning | Moc | 120 | +5 per click | 1.25 |
| Turbo | Moc | 600 | +25 per click | 1.32 |
| Mechanik | Garaz | 80 | +1 per second | 1.2 |
| Warsztat | Garaz | 450 | +8 per second | 1.28 |
| Dealer | Garaz | 2500 | +45 per second | 1.35 |

Koszt kolejnego poziomu:

```txt
nextCost = floor(baseCost * costMultiplier ^ currentLevel)
```

## Progres samochodu

Samochod moze zmieniac wyglad po przekroczeniu progow:

- Tier 1: seryjny samochod.
- Tier 2: nowe felgi i lekki tuning.
- Tier 3: sportowy body kit.
- Tier 4: turbo, neon, agresywny wyglad.
- Tier 5: supercar albo auto pokazowe.

Progi mozna liczyc po sumie poziomow ulepszen albo po lacznym zarobionym cashu. W MVP prostsze bedzie liczenie po lacznym poziomie ulepszen.

## Proponowany layout widoku

- Gorna sekcja:
  - aktualny cash,
  - `per click`,
  - `per second`.
- Srodek:
  - duzy samochod do klikania,
  - animacja feedbacku po kliknieciu,
  - pasek progresu do kolejnego tieru auta.
- Dolna sekcja:
  - zakladki albo segmenty: `Moc`, `Garaz`, pozniej `Styl`, `Auto`.
  - lista ulepszen z cena, poziomem i przyciskiem zakupu.

Widok powinien byc gesty i czytelny, bo to ekran gry uzywany wielokrotnie. Nie robimy landing page ani ekranu opisowego.

## Pomysly na dodatkowe funkcje

- Combo za szybkie klikanie.
- Krytyczne klikniecie, np. losowe x5.
- Nitro jako aktywny boost na 15 sekund.
- Misje dzienne: wykonaj 500 klikniec, kup 10 ulepszen.
- Osiagniecia: pierwszy turbo, pierwszy milion, pelny garaz.
- Bonus offline naliczany po powrocie do gry.
- Skrzynki z czesciami.
- Kolekcja samochodow z roznymi bonusami.
- Prestiz: reset progresu w zamian za stale mnozniki.
- Mini eventy: wyscig uliczny, zlot tuningowy, aukcja czesci.

## Backlog sprintu

### Zadanie 1: model danych gry

Status: zrobione w pierwszej iteracji.

Zaimplementowane pliki:

- `apps/mobile/src/features/car-clicker/types.ts`
- `apps/mobile/src/features/car-clicker/upgrades.ts`
- `apps/mobile/src/features/car-clicker/economy.ts`
- `apps/mobile/src/features/car-clicker/index.ts`

Co zostalo przygotowane:

- Typy stanu gry, ulepszen i wyniku zakupu.
- Lista startowych ulepszen dla sciezek `Moc` i `Garaz`.
- Czyste funkcje ekonomii do liczenia ceny, `per click`, `per second` i tieru auta.
- Funkcje akcji gry: zebranie dochodu z klikniecia, zebranie dochodu pasywnego i zakup ulepszenia.
- Kod bez zaleznosci od Reacta, gotowy do testow jednostkowych i podpiecia pod ekran lub store.

Druga iteracja:

- Dodano mapowanie ulepszen po `id`, zeby logika zakupu nie przeszukiwala listy przy kazdej akcji.
- Dodano selektory danych dla UI sklepu: poziom, kolejny koszt, dostepnosc zakupu, brakujacy cash i status max level.
- Dodano model progresu tieru auta: aktualny tier, kolejny tier, prog, procent progresu i liczba poziomow brakujacych do awansu.
- Utrzymano rozdzial na konfiguracje, typy i czyste funkcje ekonomii, bez zaleznosci od React Native.

- Zdefiniowac typy stanu gry i ulepszen.
- Przygotowac liste startowych ulepszen.
- Dodac funkcje liczenia ceny kolejnego poziomu.
- Dodac funkcje przeliczania `perClick` i `perSecond`.

Kryteria akceptacji:

- Kazde ulepszenie ma nazwe, koszt, poziom i efekt.
- Cena rosnie po kazdym zakupie.
- Stan gry da sie latwo podlaczyc do komponentu widoku.

### Zadanie 2: podstawowy ekran gry

Status: pierwsza iteracja zrobiona.

Zaimplementowane w `apps/mobile/src/app/game.tsx`:

- Podmieniono ekran gry na podstawowy widok Car Clicker.
- Podpieto stan poczatkowy z `createInitialCarClickerState`.
- Podpieto akcje klikniecia samochodu przez `collectClickIncome`.
- Pokazano `cash`, `per click`, `per second` i aktualny tier auta.
- Dodano prosty samochod zbudowany z komponentow React Native jako tymczasowy, kontrolowany wizual.
- Dodano pasek progresu do kolejnego tieru przez `getCarTierProgress`.

Poza zakresem tej iteracji:

- Sklep ulepszen zostaje w Zadaniu 3.
- Dochod pasywny z timerem zostaje w Zadaniu 4.
- Zaawansowane animacje i plywajacy tekst zostaja w Zadaniu 5.

Druga iteracja:

- Odchudzono `apps/mobile/src/app/game.tsx` do roli kontenera stanu i ukladu.
- Wyniesiono panel statystyk do `CarClickerStatsPanel`.
- Wyniesiono klikalny samochod do `CarTapButton`.
- Wyniesiono pasek progresu tieru do `CarTierProgressPanel`.
- Dodano `formatCarClickerCash`, zeby formatowanie waluty bylo wspolne dla ekranu i przyszlego sklepu.
- Dodano `ScrollView`, zeby podstawowy widok byl odporniejszy na nizsze ekrany telefonow.

Trzecia iteracja:

- Dodano `useCarClickerGame` jako hook feature zarzadzajacy stanem ekranu gry.
- Przeniesiono inicjalizacje stanu, wyliczanie progresu tieru i akcje klikniecia poza plik routingu.
- Uproszczono `apps/mobile/src/app/game.tsx`, zeby byl glownie kompozycja layoutu.
- Przygotowano miejsce na kolejne akcje, np. zakup ulepszenia i dochod pasywny, bez rozbudowywania komponentu ekranu.

Czwarta iteracja:

- Dodano `CAR_CLICKER_SCREEN` jako wspolna konfiguracje tekstow i metadanych widoku.
- Podpieto tytul, opis i label przycisku samochodu do konfiguracji zamiast twardych stringow w komponentach.
- Zmieniono etykiete zakladki gry na `Clicker` w nawigacji native i web.
- Uporzadkowano nazewnictwo ekranu przed przejsciem do sklepu ulepszen.

- Dodac ekran lub rozbudowac istniejacy ekran gry.
- Pokazac cash, `per click` i `per second`.
- Dodac klikalny samochod.
- Dodac akcje `tap`, ktora zwieksza cash.

Kryteria akceptacji:

- Klikniecie w samochod natychmiast zwieksza cash.
- UI nie przeskakuje przy zmianie wartosci.
- Ekran dobrze miesci sie na telefonie.

### Zadanie 3: sklep ulepszen

Status: pierwsza iteracja zrobiona.

Zaimplementowane:

- Dodano `UpgradeShopPanel` jako komponent listy ulepszen.
- Podpieto `upgradeViews` w `useCarClickerGame`, korzystajac z selektora `getUpgradeViews`.
- Dodano akcje `purchaseUpgrade`, ktora korzysta z `purchaseCarClickerUpgrade`.
- Pokazano nazwe, opis, poziom, koszt, efekt i brakujaca kwote dla kazdego ulepszenia.
- Przyciski zakupu sa wylaczone, gdy gracz ma za malo cashu albo ulepszenie jest na max level.
- Zakup odejmuje cash, zwieksza poziom i od razu aktualizuje `per click`, `per second` oraz progres tieru.

Poza zakresem tej iteracji:

- Filtrowanie po kategoriach i segmenty `Moc` / `Garaz`.
- Lepsze sortowanie sklepu i stany pustej listy.
- Animacje zakupu i feedback po zakupie.

Druga iteracja:

- Dodano filtr kategorii sklepu: `Wszystkie`, `Moc`, `Garaz`.
- Dodano `CarClickerUpgradeCategoryFilter`, zeby UI mogl obslugiwac filtr `all` bez mieszania go z realnymi kategoriami ulepszen.
- Dodano `CAR_CLICKER_UPGRADE_CATEGORY_OPTIONS` jako konfiguracje segmentow sklepu.
- Przeniesiono wybrana kategorie do `useCarClickerGame`, razem z akcja `selectUpgradeCategory`.
- `UpgradeShopPanel` renderuje segmenty kategorii i dostaje juz przefiltrowana liste ulepszen.
- Przygotowano strukture pod pozniejsze kategorie `Styl` i `Automatyzacja`.

Trzecia iteracja:

- Dodano `CarClickerPurchaseFeedback` jako typ ostatniego wyniku zakupu.
- `useCarClickerGame` przechowuje ostatni feedback zakupu i aktualizuje go przy kazdej probie kupna.
- `UpgradeShopPanel` pokazuje komunikat po zakupie, braku cashu albo probie zakupu ulepszenia na max level.
- Doprecyzowano etykiete przycisku zakupu: `Kup <koszt>`, sam koszt dla niedostepnych zakupow i `Max` dla limitu poziomu.
- Dodano `accessibilityState` dla wylaczonych przyciskow zakupu.

Czwarta iteracja:

- Dodano `CarClickerSessionState`, ktory laczy stan gry, wybrana kategorie sklepu i feedback zakupu.
- Dodano pure reducer `carClickerReducer` z akcjami `collect_click`, `purchase_upgrade` i `select_upgrade_category`.
- Przeniesiono logike zakupu z hooka do reducera, zeby kolejne zakupy bazowaly na najnowszym stanie Reacta.
- `useCarClickerGame` odpowiada teraz za memoizowane selektory i dispatch akcji, a nie za reczne skladanie zmian stanu.
- Reducer jest gotowy do testow jednostkowych bez renderowania komponentow.

Piata iteracja:

- Dodano `compareUpgradeViews` jako czysta funkcje sortowania ulepszen.
- `getUpgradeViews` zwraca teraz liste posortowana: najpierw dostepne zakupy, potem nizszy koszt, a max level na koncu.
- Dodano stan pustej listy w `UpgradeShopPanel`, zeby sklep mial poprawny UI po dodaniu przyszlych kategorii bez ulepszen.
- Sortowanie pozostaje poza komponentem UI, wiec sklep renderuje juz gotowy model widoku.

- Pokazac liste ulepszen.
- Dodac przycisk kupna.
- Wylaczyc przycisk, gdy brakuje cashu.
- Pokazac aktualny poziom i kolejny koszt.

Kryteria akceptacji:

- Zakup odejmuje cash.
- Zakup zwieksza poziom ulepszenia.
- Efekt ulepszenia zmienia `per click` albo `per second`.

### Zadanie 4: pasywny dochod

Status: pierwsza iteracja zrobiona.

Zaimplementowane:

- Dodano akcje reducera `collect_passive_income` z jawnym `elapsedSeconds`.
- Akcja korzysta z istniejacej czystej funkcji `collectPassiveIncome`.
- `useCarClickerGame` uruchamia jeden interwal naliczajacy dochod pasywny co sekunde.
- Interwal jest czyszczony przy odmontowaniu hooka przez cleanup w `useEffect`.
- Aktualny `per second` byl juz widoczny w panelu statystyk, wiec po zakupie ulepszen pasywnych cash rosnie automatycznie.

Poza zakresem tej iteracji:

- Naliczanie dochodu offline po powrocie do gry.
- Optymalizacja zatrzymywania timera, gdy `perSecond` wynosi 0.
- Animacja albo osobny feedback dla pasywnego przychodu.

Druga iteracja:

- Timer pasywnego dochodu startuje dopiero wtedy, gdy `perSecond` jest wieksze od 0.
- `useEffect` zalezy od `game.perSecond`, wiec po zakupie ulepszenia pasywnego interwal startuje automatycznie.
- Cleanup dalej usuwa poprzedni interwal, wiec zmiana wartosci `perSecond` nie tworzy duplikatow timerow.
- Usunieto niepotrzebna prace w tle na poczatku gry, gdy gracz nie ma jeszcze pasywnego dochodu.

Trzecia iteracja:

- Dodano timestamp ostatniego ticka pasywnego dochodu przez `useRef`.
- Timer przekazuje do reducera realny `elapsedSeconds`, zamiast zawsze zakladac idealna jedna sekunde.
- Przy zmianie `perSecond` albo czyszczeniu interwalu timestamp jest resetowany.
- Naliczanie jest bardziej odporne na opoznienia JS thread i chwilowe przyciecia aplikacji.

Czwarta iteracja:

- Dodano obsluge `AppState`, zeby po powrocie aplikacji na foreground doliczyc pasywny dochod za realny czas od ostatniego ticka.
- Interwal nalicza dochod tylko, gdy aplikacja jest aktywna.
- Cleanup usuwa teraz zarowno interwal, jak i subskrypcje `AppState`.
- `collectPassiveIncome` nie ucina juz dochodu przez `floor` na kazdym ticku, wiec opoznione ticki nie gubia ulamkow przychodu.

Piata iteracja:

- Wyniesiono obsluge timera, timestampow i `AppState` do `usePassiveIncomeTicker`.
- `useCarClickerGame` nie zna juz szczegolow interwalu; przekazuje tylko `isEnabled` i akcje dispatchowana na tick.
- Hook timera trzyma aktualny callback w refie, wiec nie restartuje interwalu przy kazdym renderze.
- Separacja ulatwia testowanie i dalsze uzycie timera, np. przy zapisie lokalnym albo osobnym feedbacku pasywnego przychodu.

- Dodac timer naliczajacy `per second`.
- Upewnic sie, ze naliczanie nie tworzy wielu timerow po rerenderach.
- Pokazac aktualny `per second` w UI.

Kryteria akceptacji:

- Cash rosnie automatycznie po zakupie ulepszen pasywnych.
- Timer jest czyszczony po opuszczeniu komponentu.

### Zadanie 5: feedback i progres wizualny

- Dodac animacje klikniecia samochodu.
- Dodac plywajacy tekst z zarobkiem po kliknieciu.
- Dodac progress do kolejnego tieru auta.
- Zmienic etykiete lub wyglad auta po awansie tieru.

Kryteria akceptacji:

- Klikniecie jest odczuwalne wizualnie.
- Gracz widzi, ile brakuje do kolejnego etapu auta.
- Efekty nie zaslaniaja kluczowych przyciskow.

### Zadanie 6: zapis lokalny

- Sprawdzic, jaki storage jest juz uzywany w aplikacji.
- Jesli brak gotowego storage, dodac najprostszy lokalny zapis dopiero po decyzji technologicznej.
- Zapisywac cash, poziomy ulepszen i tier auta.

Kryteria akceptacji:

- Po zamknieciu i ponownym otwarciu aplikacji stan gry wraca.
- Bledny albo pusty zapis nie psuje startu gry.

## Definicja ukonczenia sprintu

- Widok car clickera jest dostepny w aplikacji.
- Gracz moze klikac samochod i zarabiac walute.
- Gracz moze kupic kilka ulepszen.
- Ulepszenia realnie zwiekszaja `per click` lub `per second`.
- UI pokazuje aktualne wartosci i stan zakupu.
- Podstawowa petla gry jest testowalna bez backendu.
- Kod przechodzi lokalne sprawdzenie TypeScript/lint, jesli projekt ma takie komendy.

## Decyzje do podjecia przed implementacja

- Czy waluta ma miec polska nazwe, np. `kasa`, czy neutralna, np. `cash`.
- Czy samochod ma byc grafika z assetow, prosty komponent UI, czy tymczasowy placeholder.
- Czy progres ma byc zapisywany tylko lokalnie, czy docelowo synchronizowany z backendem.
- Czy widok gry ma byc osobna zakladka, czy ekran otwierany z obecnego `game.tsx`.

## Rekomendacja na pierwszy build

Najpierw zrobic petle:

```txt
klik -> cash -> zakup ulepszenia -> wiekszy zarobek -> kolejny zakup
```

Dopiero potem dodawac efekty wizualne, misje, prestiz i kolekcje samochodow. Bez dobrej petli ekonomii dodatkowe funkcje beda tylko ozdobami.
