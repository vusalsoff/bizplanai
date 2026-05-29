const API = {
    BASE_URL: 'https://api.yourplatform.com',

    post: async function(endpoint, data) {
        try {
            const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    // Sahibkar sifarişi
    submitOrder: async function(orderData) {
        return await this.post('orders', orderData);
    }
};