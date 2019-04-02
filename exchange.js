let USDrate
let EURrate
let GBPrate

const getExchangeRates = async () => {
    return fetch('https://www.dolarsi.com/api/api.php?type=cotizador')
        .then(r => r.json())
        .then(data => {
            // Saving the last time the data was fetched since the API does not return any dates
            const timestamp = new Date()
            const timestampMessage = `Fecha de cotizacion: ${timestamp.getDate()} / ${timestamp.getMonth()} / ${timestamp.getFullYear()}  ${timestamp.getHours()} : ${timestamp.getMinutes()}`
            localStorage.setItem('timestampMessage', JSON.stringify(timestampMessage))

            return data
        })
        .catch(err => {
            const ratesJSON = localStorage.getItem('rates')
            const errorMessage = document.createElement('p')
            if (ratesJSON) {
                errorMessage.innerHTML = "Sin conexion. Se utilizaran las ultimas tarifas guardadas."
                document.querySelector('#operations').appendChild(errorMessage)
                return JSON.parse(ratesJSON)
            } else {
                errorMessage.innerHTML = "Sin conexion ni tarifas guardadas. Intente de nuevo conectandose a internet."
                document.querySelector('#operations').appendChild(errorMessage)
            }
        });
}

const setRates = async () => {
    const exchangeRates = await getExchangeRates()

    if (exchangeRates) {
        const USDtoday = exchangeRates.find(function (currency) {
            return currency.casa.nombre === "Dolar"
        })
        USDrate = USDtoday.casa.venta.replace(/,/, ".")

        const EURtoday = exchangeRates.find(function (currency) {
            return currency.casa.nombre === "Euro"
        })
        EURrate = EURtoday.casa.venta.replace(/,/, ".")

        const GBPtoday = exchangeRates.find(function (currency) {
            return currency.casa.nombre === "Libra Esterlina"
        })
        GBPrate = GBPtoday.casa.venta.replace(/,/, ".")

        localStorage.setItem('rates', JSON.stringify(exchangeRates))
    }
}

setRates();

const getConversion = function (amount, rate) {
    const result = `ARS $ ${amount * rate}`
    const resultEl = document.querySelector('#result-outcome')
    resultEl.innerHTML = result

    const timestampJSON = localStorage.getItem('timestampMessage')
    const lastTimestamp = JSON.parse(timestampJSON)
    const timestampEl = document.querySelector('#rate-timestamp')
    timestampEl.innerHTML = lastTimestamp
}

document.querySelector('#USD').addEventListener('click', e => {
    const userAmount = document.querySelector('#user-amount').value
    const description = `${userAmount} USD en una tarifa de ${USDrate} pesos`
    if (USDrate) {
        document.querySelector('#result-description').innerHTML = description
        getConversion(userAmount, USDrate)
    } else {
        document.querySelector('#result-description').innerHTML = "No es posible realizar la operacion."
    }
})

document.querySelector('#EUR').addEventListener('click', e => {
    const userAmount = document.querySelector('#user-amount').value
    const description = `${userAmount} EUR en una tarifa de ${EURrate} pesos`
    if (EURrate) {
        document.querySelector('#result-description').innerHTML = description
        getConversion(userAmount, EURrate)
    } else {
        document.querySelector('#result-description').innerHTML = "No es posible realizar la operacion."
    }
})

document.querySelector('#GBP').addEventListener('click', e => {
    const userAmount = document.querySelector('#user-amount').value
    const description = `${userAmount} GBP en una tarifa de ${GBPrate} pesos`
    if (GBPrate) {
        document.querySelector('#result-description').innerHTML = description
        getConversion(userAmount, GBPrate)
    } else {
        document.querySelector('#result-description').innerHTML = "No es posible realizar la operacion."
    } 
})