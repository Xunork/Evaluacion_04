export const fetchPlatos = () => {
    return fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=Chile')
        .then(res => {
            if (!res.ok) {
                throw new Error("Error en la red");
            }
            return res.json();
        });
};
