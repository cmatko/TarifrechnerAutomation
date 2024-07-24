const { test, expect } = require('@playwright/test');

test.describe('Wien Energie Tarifberater Eingabemaske Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.wienenergie.at/privat/produkte/strom/', { waitUntil: 'load', timeout: 180000 });

        // Sicherstellen, dass die Seite vollständig geladen ist
        await page.waitForSelector('form#product-recommendation', { timeout: 90000 });

        // Versuchen, das Cookie-Consent-Modale Dialogfenster zu schließen
        const consentSelectors = [
            'button:has-text("Alle akzeptieren")',
            'button:has-text("Auswahl akzeptieren")',
            'button.Button-module__primary-XVAEbA', // Möglicher Klassenname für die Buttons
            'div.CookieConsent-module__actions-zO6ia1 button', // Selektor für das Button-Container
        ];

        let consentClosed = false;
        for (const selector of consentSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 10000 }); // Verlängern der Wartezeit auf 10 Sekunden
                const consentButton = await page.$(selector);
                if (consentButton) {
                    console.log(`Found consent button with selector: ${selector}`);
                    await consentButton.click();
                    // Warten bis das Dialogfenster nicht mehr sichtbar ist
                    await page.waitForSelector(selector, { state: 'hidden', timeout: 10000 });
                    consentClosed = true;
                    break;
                }
            } catch (error) {
                console.log(`Error clicking consent button with selector ${selector}: ${error}`);
            }
        }

        if (!consentClosed) {
            // Workaround: Entfernen des Dialogfensters mit JavaScript
            await page.evaluate(() => {
                const consentModal = document.querySelector('div[role="dialog"]');
                if (consentModal) {
                    consentModal.remove();
                }
            });
        }
    });

    // Testfall: Seitenaufruf und Grundelemente prüfen
    test('Seitenaufruf und Grundelemente', async ({ page }) => {
        await page.goto('https://www.wienenergie.at/privat/produkte/strom/');
        
        // Überprüfen, ob der Titel der Seite korrekt ist
        await expect(page).toHaveTitle(/Strom anmelden » Ihr verlässlicher Stromanbieter Wien Energie/);

        // Überprüfen, ob der Header vorhanden ist
        const header = await page.$('header');
        expect(header).not.toBeNull();

        // Überprüfen, ob der Footer vorhanden ist
        const footer = await page.$('footer');
        expect(footer).not.toBeNull();
    });

    // Testfall: Tarifkarten prüfen
    test('Tarifkarten und Preise prüfen', async ({ page }) => {
        await page.goto('https://www.wienenergie.at/privat/produkte/strom/', { waitUntil: 'load', timeout: 180000 });

        // Sicherstellen, dass die Seite vollständig geladen ist
        await page.waitForSelector('div[data-purpose="category-products"]', { timeout: 90000 });

        // Überprüfen, ob Tarifkarten vorhanden sind
        const tariffCards = await page.$$('div[data-purpose="category-products"]');
        console.log(`Anzahl gefundener Tarifkarten: ${tariffCards.length}`);
        expect(tariffCards.length).toBeGreaterThan(0);

        // Überprüfen, ob die Preise auf den Tarifkarten korrekt angezeigt werden
        let noPriceInfoCount = 0;
        for (let card of tariffCards) {
            const price = await card.$('p[class*="ProductCardPrice-module__price"]');
            if (price !== null) {
                const priceText = await price.innerText();
                console.log(`Gefundener Preis: ${priceText}`);
                expect(priceText).toMatch(/[\d,]+/); // Allgemeineres Zahlenformat
            } else {
                noPriceInfoCount++;
            }
        }
        console.log(`Anzahl der Karten ohne Preisinformation: ${noPriceInfoCount}`);
    });

    // Testfall: Erhöhen und Verringern der Anzahl der Personen
    test('Personenanzahl ändern', async ({ page }) => {
        await page.waitForSelector('button[data-purpose="increment"]');
        await page.click('button[data-purpose="increment"]');
        //await page.waitForTimeout(2000); // Warten, um sicherzustellen, dass die Seite reagiert hat

        let personCount = await page.innerText('span[data-purpose="productrecommender-label"]');
        expect(personCount).toBe('3 Personen'); // Überprüfen, ob die Anzahl auf 2 erhöht wurde

        // Personenanzahl verringern
        await page.click('button[data-purpose="decrement"]');
        //await page.waitForTimeout(2000); // Warten, um sicherzustellen, dass die Seite reagiert hat

        personCount = await page.innerText('span[data-purpose="productrecommender-label"]');
        expect(personCount).toBe('2 Personen'); // Überprüfen, ob die Anzahl auf 1 verringert wurde
    });

    // Testfall: Eingabe des Jahresverbrauchs
    test('Jahresverbrauch eingeben', async ({ page }) => {
        await page.waitForSelector('input[name="usage"]');
        await page.fill('input[name="usage"]', '2300');
        await page.waitForTimeout(1000); // Warten, um sicherzustellen, dass die Eingabe übernommen wurde

        const usageValue = await page.inputValue('input[name="usage"]');
        expect(usageValue).toBe('2300'); // Überprüfen, ob der Wert korrekt eingegeben wurde
    });

    // Testfall: Eingabe der Postleitzahl
    test('Postleitzahl eingeben', async ({ page }) => {
        await page.waitForSelector('input[name="zipcode"]');
        await page.fill('input[name="zipcode"]', '1010');
        await page.waitForTimeout(1000); // Warten, um sicherzustellen, dass die Eingabe übernommen wurde

        const zipcodeValue = await page.inputValue('input[name="zipcode"]');
        expect(zipcodeValue).toBe('1010'); // Überprüfen, ob der Wert korrekt eingegeben wurde
    });

    // Testfall: Auswahl der Checkboxen
    test('Checkboxen auswählen', async ({ page }) => {
        await page.waitForSelector('div.ProductRecommender-module__filterWrapper-biWNKD', { state: 'visible', timeout: 60000 });

        const checkboxes = [
            'Nur mit Preisgarantie',
            'Nur Strom aus erneuerbarer Energie',
            'Nur ohne Bindung'
        ];

        for (const checkboxText of checkboxes) {
            const checkboxLabelSelector = `div.ProductRecommender-module__filterWrapper-biWNKD label:has-text("${checkboxText}")`;
            const checkboxSelector = `${checkboxLabelSelector} input[type="checkbox"]`;

            // Scrollen zum Element und warten bis es sichtbar ist
            await page.locator(checkboxLabelSelector).scrollIntoViewIfNeeded();
            await page.waitForSelector(checkboxLabelSelector, { state: 'visible', timeout: 10000 });
            await page.click(checkboxLabelSelector);
            await page.waitForTimeout(500); // Kurzes Warten zwischen den Aktionen
        }

        // Überprüfen, ob die Checkboxen ausgewählt sind
        for (const checkboxText of checkboxes) {
            const checkboxSelector = `div.ProductRecommender-module__filterWrapper-biWNKD label:has-text("${checkboxText}") input[type="checkbox"]`;
            expect(await page.isChecked(checkboxSelector)).toBeTruthy();
        }
    });

    // Testfall: Klicken auf "Tarife anzeigen"
    test('Tarife anzeigen', async ({ page }) => {
        await page.waitForSelector('button:has-text("Tarife anzeigen")');
        await page.click('button:has-text("Tarife anzeigen")');
        await page.waitForTimeout(5000); // Längeres Warten, um sicherzustellen, dass die Seite vollständig geladen ist

        // Überprüfen, ob die Tarifkarten angezeigt werden
        await page.waitForSelector('div[data-purpose="category-products"]', { timeout: 90000 });
        const tariffCards = await page.$$('div[data-purpose="category-products"]');
        expect(tariffCards.length).toBeGreaterThan(0);
    });

      // Testfall: E2E Test - Personenanzahl erhöhen und Preisveränderung ausgeben
    test('Personenanzahl erhöhen und Preisveränderung ausgeben', async ({ page }) => {
        // Postleitzahl eingeben
        await page.fill('input[name="zipcode"]', '1010');
        await page.press('input[name="zipcode"]', 'Enter');

        // Initiale Preise erfassen
        await page.waitForSelector('div[data-purpose="category-products"]', { timeout: 90000 });
        let initialPrices = await getPrices(page);
        console.log('Initiale Preise:', initialPrices);

        // Personenanzahl erhöhen
        console.log('Erhöhen der Personenanzahl...');
        await page.click('button[data-purpose="increment"]');
        await page.waitForTimeout(10000); // Längeres Warten, um sicherzustellen, dass die Seite reagiert hat

        // Überprüfen, ob die Anzahl der Personen korrekt erhöht wurde
        let personCount = await page.innerText('span[data-purpose="productrecommender-label"]');
        console.log('Personenanzahl nach Erhöhung:', personCount);
        expect(personCount).toContain('Personen');

        // Preise nach Erhöhung der Personenanzahl erfassen
        await page.waitForSelector('div[data-purpose="category-products"]', { timeout: 90000 });
        let updatedPrices = await getPrices(page);
        console.log('Aktualisierte Preise nach Erhöhung der Personenanzahl:', updatedPrices);

        // Preise trimmen
        initialPrices = initialPrices.map(price => price.trim());
        updatedPrices = updatedPrices.map(price => price.trim());

        // Überprüfen, ob die Preise aktualisiert wurden
        expect(updatedPrices).not.toEqual(initialPrices);
    });

    // Testfall: E2E Test - Personenanzahl verringern und Preisveränderung ausgeben
    test('Personenanzahl verringern und Preisveränderung ausgeben', async ({ page }) => {
        // Postleitzahl eingeben
        await page.fill('input[name="zipcode"]', '1010');
        await page.press('input[name="zipcode"]', 'Enter');

        // Initiale Preise erfassen
        await page.waitForSelector('div[data-purpose="category-products"]', { timeout: 90000 });
        let initialPrices = await getPrices(page);
        console.log('Initiale Preise:', initialPrices);

        // Personenanzahl erhöhen
        console.log('Erhöhen der Personenanzahl...');
        await page.click('button[data-purpose="increment"]');
        await page.waitForTimeout(10000); // Längeres Warten, um sicherzustellen, dass die Seite reagiert hat

        // Personenanzahl verringern
        console.log('Verringern der Personenanzahl...');
        await page.click('button[data-purpose="decrement"]');
        await page.waitForTimeout(10000); // Längeres Warten, um sicherzustellen, dass die Seite reagiert hat

        // Überprüfen, ob die Anzahl der Personen korrekt verringert wurde
        let personCount = await page.innerText('span[data-purpose="productrecommender-label"]');
        console.log('Personenanzahl nach Verringerung:', personCount);
        expect(personCount).toContain('Personen');

        // Preise nach Verringerung der Personenanzahl erfassen
        await page.waitForSelector('div[data-purpose="category-products"]', { timeout: 90000 });
        let updatedPrices = await getPrices(page);
        console.log('Aktualisierte Preise nach Verringerung der Personenanzahl:', updatedPrices);

        // Preise trimmen
        initialPrices = initialPrices.map(price => price.trim());
        updatedPrices = updatedPrices.map(price => price.trim());

        // Überprüfen, ob die Preise aktualisiert wurden
        expect(updatedPrices).not.toEqual(initialPrices);
    });

    // Zusätzlicher Testfall: E2E Test - Fehlermeldungen bei fehlenden Eingaben im Filtermodul
    test('Fehlermeldungen bei fehlenden Eingaben im Filtermodul', async ({ page }) => {
        // Navigiere zur Seite
        await page.goto('https://www.wienenergie.at/privat/produkte/strom/', { waitUntil: 'load', timeout: 180000 });

        // Löschen des vorausgefüllten Jahresverbrauchswerts
        await page.waitForSelector('input[name="usage"]');
        await page.fill('input[name="usage"]', ''); // Leeren des Feldes
        await page.press('input[name="usage"]', 'Tab'); // Fokus aus dem Feld entfernen, um die Validierung auszulösen

        // Löschen des vorausgefüllten Postleitzahlwerts
        await page.waitForSelector('input[name="zipcode"]');
        await page.fill('input[name="zipcode"]', ''); // Leeren des Feldes
        await page.press('input[name="zipcode"]', 'Tab'); // Fokus aus dem Feld entfernen, um die Validierung auszulösen

        // Klicken auf "Tarife anzeigen", ohne Eingaben zu tätigen
        await page.waitForSelector('button:has-text("Tarife anzeigen")');
        await page.click('button:has-text("Tarife anzeigen")');
        await page.waitForTimeout(5000); // Längeres Warten, um sicherzustellen, dass die Seite reagiert hat

        // Überprüfen, ob die Fehlermeldung für den Jahresverbrauch angezeigt wird
        const usageError = await page.locator('div#usage.ProductRecommender-module__error-G9Rxk0');
        await usageError.waitFor({ state: 'visible', timeout: 10000 }); // Warten, bis die Fehlermeldung sichtbar ist
        expect(await usageError.isVisible()).toBeTruthy();
        expect(await usageError.innerText()).toBe('Bitte geben Sie Ihren Jahresverbrauch ein');

        // Überprüfen, ob die Fehlermeldung für die Postleitzahl angezeigt wird
        const zipcodeError = await page.locator('div#zipcode.ProductRecommender-module__error-G9Rxk0');
        await zipcodeError.waitFor({ state: 'visible', timeout: 10000 }); // Warten, bis die Fehlermeldung sichtbar ist
        expect(await zipcodeError.isVisible()).toBeTruthy();
        expect(await zipcodeError.innerText()).toBe('Bitte geben Sie eine gültige Postleitzahl an');
    });

    // Testfall: Eingabe von nicht-numerischen Werten in die Eingabefelder
    test('Nicht-numerische Eingaben in Jahresverbrauch und Postleitzahl', async ({ page }) => {
        // Navigiere zur Seite
        await page.goto('https://www.wienenergie.at/privat/produkte/strom/', { waitUntil: 'load', timeout: 180000 });

        // Sicherstellen, dass die Seite vollständig geladen ist
        await page.waitForSelector('form#product-recommendation', { timeout: 90000 });

        // Versuchen, das Cookie-Consent-Modale Dialogfenster zu schließen
        const consentSelectors = [
            'button:has-text("Alle akzeptieren")',
            'button:has-text("Auswahl akzeptieren")',
            'button.Button-module__primary-XVAEbA', // Möglicher Klassenname für die Buttons
            'div.CookieConsent-module__actions-zO6ia1 button', // Selektor für das Button-Container
        ];

        let consentClosed = false;
        for (const selector of consentSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 10000 }); // Verlängern der Wartezeit auf 10 Sekunden
                const consentButton = await page.$(selector);
                if (consentButton) {
                    console.log(`Found consent button with selector: ${selector}`);
                    await consentButton.click();
                    // Warten bis das Dialogfenster nicht mehr sichtbar ist
                    await page.waitForSelector(selector, { state: 'hidden', timeout: 10000 });
                    consentClosed = true;
                    break;
                }
            } catch (error) {
                console.log(`Error clicking consent button with selector ${selector}: ${error}`);
            }
        }

        if (!consentClosed) {
            // Workaround: Entfernen des Dialogfensters mit JavaScript
            await page.evaluate(() => {
                const consentModal = document.querySelector('div[role="dialog"]');
                if (consentModal) {
                    consentModal.remove();
                }
            });
        }

        // Versuch, nicht-numerische Werte in das Jahresverbrauchsfeld einzugeben
        await page.waitForSelector('input[name="usage"]');
        await page.fill('input[name="usage"]', 'abc!@#');
        let usageValue = await page.inputValue('input[name="usage"]');
        console.log(`Eingegebener Jahresverbrauchswert: ${usageValue}`);
        expect(usageValue).toBe(''); // Überprüfen, ob das Feld leer bleibt

        // Versuch, nicht-numerische Werte in das Postleitzahlfeld einzugeben
        await page.waitForSelector('input[name="zipcode"]');
        await page.fill('input[name="zipcode"]', 'xyz!@#');
        let zipcodeValue = await page.inputValue('input[name="zipcode"]');
        console.log(`Eingegebener Postleitzahlwert: ${zipcodeValue}`);
        expect(zipcodeValue).toBe(''); // Überprüfen, ob das Feld leer bleibt
    });

});


async function getPrices(page) {
    const prices = await page.$$eval('div[data-purpose="category-products"] p[class*="ProductCardPrice-module__price"]', elements => 
        elements.map(el => el.innerText)
    );
    return prices;

}
