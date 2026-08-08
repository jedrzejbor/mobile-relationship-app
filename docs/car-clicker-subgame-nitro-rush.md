# Car Clicker Subgame: Nitro Rush

## Cel

`Nitro Rush` to szybka subgra wewnatrz Car Clickera. Glowny clicker zostaje miejscem, w ktorym gracz zarabia cash, ulepsza auto i buduje progres. Subgra jest krotkim, intensywnym trybem arcade, do ktorego gracz wchodzi, zeby wygrac czasowe bonusy do glownej ekonomii.

Inspiracja to hyper-casual runner z reklam mobilnych: szybki ruch do przodu, bramki z wartosciami, natychmiastowy feedback, duze liczby, mnozniki, efektowne przejscia przez progi i bardzo krotka sesja. Nie kopiujemy konkretnej gry ani reklamy. Bierzemy tylko format: prosta decyzja co sekunde, duzo wizualnej nagrody i jasny wynik na koncu.

## Fantasy gracza

Gracz ulepsza swoje auto w Car Clickerze, a potem odpala specjalny przejazd testowy. Im lepiej przygotowana fura, tym latwiej zrobic dobry wynik w subgrze. Wynik z przejazdu wraca do glownego clickera jako bonus: wiecej cashu przez kilka minut, przyspieszony czas pasywnego dochodu albo darmowe/tymczasowe ulepszenie.

## Core Loop

1. Gracz wchodzi z ekranu Car Clickera w tryb `Nitro Rush`.
2. Wybiera aktualne auto albo startuje od razu aktualnie aktywnym autem.
3. Auto jedzie samo do przodu po torze.
4. Gracz przesuwa auto lewo/prawo, zeby wybierac bramki i omijac przeszkody.
5. Bramki zwiekszaja wynik, mnoznik albo tymczasowa moc.
6. Przeszkody zmniejszaja mnoznik, zabieraja paliwo/nitro albo skracaja run.
7. Na koncu runa wynik zamienia sie w bonus do glownego clickera.
8. Gracz wraca do Car Clickera i widzi aktywny bonus z timerem.

## Widok i styl

Subgra powinna byc osobnym ekranem, ale wizualnie nadal nalezec do Car Clickera:

- ciemny racing HUD,
- neonowy pomarancz/cyan/fiolet,
- szybkie animacje pickupow,
- duze liczby nad bramkami,
- widoczny mnoznik runa,
- pasek nitro albo paliwa,
- ekran wyniku z duzym CTA `Odbierz bonus`.

Tor moze wygladac jak nocna droga, most, tunel albo test track. Pierwsza wersja nie musi miec pelnego 3D. Wystarczy pseudo-3D/perspektywa w React Native, jesli gameplay bedzie czytelny.

## Mechaniki runa

### Bramki

Bramki stoja na torze i wymuszaja szybki wybor:

- `+1`, `+5`, `+10` do score,
- `x2`, `x3` do aktualnego mnoznika,
- `+Nitro`, czyli chwilowe przyspieszenie,
- `Repair`, czyli naprawa po kolizji,
- `Bonus Time`, czyli wydluzenie runa o kilka sekund.

Wazne: bramki musza byc czytelne w mniej niz sekunde. Tekst ma byc duzy, krotki i kontrastowy.

### Przeszkody

Przeszkody sluza do utrzymania napiecia:

- blokady drogowe,
- olej na drodze,
- traffic cones,
- uszkodzone auta,
- czerwone bramki `-score` albo `x0.5`.

Kolizja nie powinna od razu konczyc gry w MVP. Lepszy efekt to strata czesci mnoznika albo nitro, bo gracz szybciej zaczyna kolejny run.

### Combo

Za kilka dobrych wyborow z rzedu gracz dostaje combo:

- `Perfect line x3`,
- `Clean gates`,
- `No crash streak`,
- dodatkowy efekt wizualny na aucie.

Combo zwieksza koncowy bonus, ale nie powinno byc wymagane do zwyklego progresu.

## Powiazanie z glownym Car Clickerem

Subgra nie jest osobna ekonomia. Jest wzmacniaczem glownego clickera.

Przykladowe nagrody:

- `Cash Boost`: +50% cash za klik przez 5 minut.
- `Turbo Passive`: +100% per second przez 3 minuty.
- `Fast Clock`: pasywny dochod nalicza sie 2x szybciej przez 2 minuty.
- `Lucky Upgrade`: nastepne ulepszenie ma -20% kosztu.
- `Instant Cash`: jednorazowa nagroda zależna od wyniku runa.
- `Nitro Clicks`: pierwsze 100 klikniec po runie ma dodatkowy mnoznik.

Bonus powinien miec:

- typ,
- wartosc,
- czas trwania albo liczbe uzyc,
- zrodlo `nitro_rush`,
- timestamp startu i konca,
- jasny opis w UI glownego clickera.

## Wplyw ulepszen auta na subgre

Aktualne ulepszenia z Car Clickera powinny dawac lekkie przewagi w `Nitro Rush`, ale nie powinny psuc balansu:

- `Lepsze opony`: wieksza tolerancja skretu albo mniejsza kara za olej.
- `Chip tuning`: wyzszy startowy mnoznik score.
- `Turbo`: dluzszy pasek nitro.
- `Mechanik`: jedna darmowa naprawa po kolizji.
- `Warsztat`: lepsza jakosc nagrod po runie.
- `Dealer`: wieksza szansa na bonus premium.

To sprawia, ze glowny clicker i subgra napedzaja sie nawzajem.

## Progresja i dostep

MVP:

- subgra odblokowana od razu albo po pierwszym zakupie ulepszenia,
- darmowy run co okreslony czas,
- opcjonalnie dodatkowy run za cash z gry,
- czas jednego runa: 30-45 sekund,
- wynik koncowy: `score`, `combo`, `best gate`, `reward`.

Pozniejsze iteracje:

- codzienne wyzwania,
- tygodniowe tory,
- leaderboard,
- rzadkie bonusy,
- eventowe bramki,
- ranking znajomych.

## Ranking

Ranking powinien byc dodatkiem do subgry, nie wymaganiem MVP.

Najprostszy model:

- `bestScoreDaily`,
- `bestScoreWeekly`,
- `bestScoreAllTime`,
- `lastRunScore`,
- `userId`,
- `carTier`,
- `createdAt`.

Ranking moze miec trzy widoki:

- globalny top,
- znajomi,
- moja pozycja.

Wazne: jesli ranking bedzie backendowy, wynik nie powinien byc slepo zaufany z klienta. Minimalnie backend powinien walidowac zakres wyniku, czas runa, aktywne bonusy i wersje konfiguracji runa.

## Ryzyka projektowe

- Zbyt duzo efektow moze przykryc czytelnosc wyboru bramek.
- Zbyt mocne bonusy moga zepsuc ekonomie glownego clickera.
- Zbyt dlugie runy beda przeszkadzac w petli clickera.
- Jesli ranking bedzie globalny, potrzebna jest walidacja anty-cheat.
- Subgra nie powinna wymagac trudnego sterowania; ma byc szybka i natychmiast zrozumiala.

## MVP techniczne

Pierwsza implementacja powinna byc maksymalnie mala:

- osobny ekran `NitroRushScreen`,
- czysty model runa i nagrod bez zaleznosci od UI,
- konfiguracja bramek i przeszkod jako dane,
- prosty renderer toru w React Native,
- wynik runa zwracany do Car Clickera,
- aktywny bonus widoczny w panelu statystyk glownego clickera,
- lokalny zapis aktywnego bonusu razem z save Car Clickera.

Backend i ranking zostawiamy jako kolejny sprint, chyba ze najpierw chcemy zbudowac rywalizacje zamiast lokalnej subgry.

## Proponowane zadania

1. Dopisac model bonusow czasowych do Car Clickera.
2. Dodac konfiguracje `Nitro Rush`: bramki, przeszkody, nagrody.
3. Zbudowac prosty ekran runa bez finalnych assetow.
4. Podpiac wynik runa do aktywnego bonusu w glownej grze.
5. Dodac ekran wyniku i komunikat aktywnego bonusu.
6. Dopiero potem dodac ranking backendowy.

## Definicja sukcesu

Subgra jest dobra, jesli gracz po 30 sekundach:

- rozumie, co robi,
- czuje szybki progres,
- widzi duze liczby i nagrode,
- wraca do glownego clickera z aktywnym bonusem,
- chce odpalic kolejny run po cooldownie.
