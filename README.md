# TarifrechnerAutomation

# Wien Energie Tarifberater Eingabemaske Tests

Diese Tests überprüfen verschiedene Aspekte der Eingabemaske des Wien Energie Tarifberaters. Die Tests werden mit [Playwright](https://playwright.dev/) durchgeführt.

## Voraussetzungen

- Node.js installiert
- Playwright installiert (`npm install playwright`)

## Installation

1. Klone das Repository:
    ```bash
    git clone <repository-url>
    ```
2. Gehe in das Verzeichnis des Projekts:
    ```bash
    cd <project-directory>
    ```
3. Installiere die Abhängigkeiten:
    ```bash
    npm install
    ```

## Tests ausführen

Um die Tests auszuführen, verwende den folgenden Befehl:
```bash
npx playwright test --headed

/*
## Testfälle


## -Seitenaufruf und Grundelemente
## Beschreibung: Überprüft, ob die Seite korrekt geladen wird und die Grundelemente (Header und Footer) vorhanden sind.
## Test: tarifberater final.spec.js: Seitenaufruf und Grundelemente
## Erklärung: Der Test navigiert zur Seite, überprüft den Seitentitel und stellt sicher, dass Header und Footer vorhanden sind.

## -Tarifkarten und Preise prüfen
## Beschreibung: Überprüft, ob Tarifkarten vorhanden sind und die Preise auf den Tarifkarten korrekt angezeigt werden.
## Test: tarifberater final.spec.js: Tarifkarten und Preise prüfen
## Erklärung: Der Test stellt sicher, dass Tarifkarten angezeigt werden und überprüft, ob die Preise korrekt im richtigen Format dargestellt werden.

## -Personenanzahl ändern
## Beschreibung: Erhöht und verringert die Anzahl der Personen und überprüft, ob die Änderungen korrekt sind.
## Test: tarifberater final.spec.js: Personenanzahl ändern
## Erklärung: Der Test erhöht die Personenanzahl und überprüft, ob die Anzeige entsprechend aktualisiert wird. Anschließend wird die Personenanzahl wieder verringert und erneut überprüft.

## -Jahresverbrauch eingeben
## Beschreibung: Gibt den Jahresverbrauch ein und überprüft, ob der eingegebene Wert korrekt übernommen wurde.
## Test: tarifberater final.spec.js: Jahresverbrauch eingeben
## Erklärung: Der Test gibt einen Jahresverbrauchswert ein und überprüft, ob dieser korrekt im Eingabefeld angezeigt wird.

## -Postleitzahl eingeben
## Beschreibung: Gibt die Postleitzahl ein und überprüft, ob der eingegebene Wert korrekt übernommen wurde.
## Test: tarifberater final.spec.js: Postleitzahl eingeben
## Erklärung: Der Test gibt eine Postleitzahl ein und überprüft, ob diese korrekt im Eingabefeld angezeigt wird.

## -Checkboxen auswählen
## Beschreibung: Wählt verschiedene Checkboxen aus und überprüft, ob sie korrekt ausgewählt wurden.
## Test: tarifberater final.spec.js: Checkboxen auswählen
## Erklärung: Der Test wählt verschiedene Checkboxen aus und überprüft, ob sie korrekt ausgewählt sind.

## -Tarife anzeigen
## Beschreibung: Klickt auf den Button "Tarife anzeigen" und überprüft, ob die Tarifkarten angezeigt werden.
## Test: tarifberater final.spec.js: Tarife anzeigen
## Erklärung: Der Test klickt auf den Button "Tarife anzeigen" und überprüft, ob die Tarifkarten korrekt geladen und angezeigt werden.

## -Personenanzahl erhöhen und Preisveränderung ausgeben
## Beschreibung: Erhöht die Anzahl der Personen und überprüft, ob sich die Preise entsprechend ändern.
## Test: tarifberater final.spec.js: Personenanzahl erhöhen und Preisveränderung ausgeben
## Erklärung: Der Test erfasst die initialen Preise, erhöht die Personenanzahl und überprüft, ob sich die Preise entsprechend der neuen Personenanzahl ändern.

## -Personenanzahl verringern und Preisveränderung ausgeben
## Beschreibung: Verringert die Anzahl der Personen und überprüft, ob sich die Preise entsprechend ändern.
## Test: tarifberater final.spec.js: Personenanzahl verringern und Preisveränderung ausgeben
## Erklärung: Der Test erfasst die initialen Preise, verringert die Personenanzahl und überprüft, ob sich die Preise entsprechend der neuen Personenanzahl ändern.

## -Fehlermeldungen bei fehlenden Eingaben im Filtermodul
## Beschreibung: Überprüft, ob die entsprechenden Fehlermeldungen angezeigt werden, wenn keine Eingaben in den Pflichtfeldern gemacht werden.
## Test: tarifberater final.spec.js: Fehlermeldungen bei fehlenden Eingaben im Filtermodul
## Erklärung: Der Test lässt die Pflichtfelder für Jahresverbrauch und Postleitzahl leer und überprüft, ob die entsprechenden Fehlermeldungen angezeigt werden.

## -Ungültige Eingaben in den Eingabefeldern
## Beschreibung: Überprüft, ob ungültige Eingaben in den Feldern für Jahresverbrauch und Postleitzahl nicht akzeptiert werden.
## Test: tarifberater final.spec.js: Ungültige Eingaben in den Eingabefeldern
## Erklärung: Der Test versucht, ungültige Zeichen in die Eingabefelder für Jahresverbrauch und Postleitzahl einzugeben und überprüft, ob diese Eingaben nicht akzeptiert werden.

## -Struktur
## Die Tests befinden sich in der Datei tarifberater final.spec.js. Jeder Testfall ist durch entsprechende Kommentare gekennzeichnet und enthält detaillierte Beschreibungen der einzelnen Testschritte.
*/
