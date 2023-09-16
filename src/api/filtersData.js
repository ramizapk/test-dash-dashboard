export const tableSearch = (searchTerm, data, searchedField) => {
    const filteredResults = data.filter((item) =>
        item.attributes[searchedField].includes(searchTerm)
    );
    return filteredResults;
};

export const searchOrders = (searchTerm, data, endpoint) => {
    searchTerm = searchTerm.toLowerCase();

    const filteredResults = data.filter(order => {
        const user = order.user;
        let realEstate;
        if (endpoint == 'orders') {
            realEstate = order.real_estate.attributes;
        } else {
            realEstate = order.sub_construction_service.attributes;
        }
        const userName = user.name.toLowerCase();
        const realEstateName = realEstate.name.toLowerCase();

        return userName.includes(searchTerm) || realEstateName.includes(searchTerm);
    });

    return filteredResults;
};

export const tableFilters = (filter, data, searchedField, other = null) => {
    const filteredResults = data.filter((item) =>
        !other ? item.attributes[searchedField].id === filter
            : item.attributes[searchedField] == filter
    );
    return filteredResults;
};


export const countMatchingItems = (filter, data, searchedField, other = null) => {
    const matchingCount = data.reduce((count, item) => {
        if (!other ? item.attributes[searchedField].id === filter
            : item.attributes[searchedField] === filter) {
            return count + 1;
        }
        return count;
    }, 0);

    return matchingCount;
};


export const filterRealEstatesByPrice = (minPrice, maxPrice, data) => {
    const filteredResults = data.filter((item) => {
        const price = item.attributes.price; // افتراضياً أن لديك حقل يسمى "price" في العقار

        // قم بتحويل السعر إلى عدد صحيح إذا كان نصًا (يعتمد على هيكل البيانات الخاص بك)
        const itemPrice = typeof price === 'string' ? parseInt(price) : price;

        // قم بفحص ما إذا كان السعر في النطاق المطلوب
        return itemPrice >= minPrice && itemPrice <= maxPrice;
    });

    return filteredResults;
};