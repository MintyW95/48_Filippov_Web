const Api_Link = 'http://localhost:3000';
const StorageManager = 
{
    async getBets() 
    {
        try 
        {
            const res = await fetch(`${Api_Link}/bets`);
            if (!res.ok) throw new Error('ошибка сервера');
            return await res.json();
        } 
        catch (e) 
        {
            console.error('не удалось загрузить ставки:', e);
            return [];
        }
    },

    async addBet(bet) 
    {
        try 
        {
            const res = await fetch(`${Api_Link}/bets`, 
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bet)
            });
            if (!res.ok) throw new Error('ошибка при создании');
            return await res.json();
        } 
        catch (e) 
        {
            console.error('не удалось создать ставку:', e);
            return null;
        }
    },

    async updateBet(id, updates) 
    {
        try 
        {
            const res = await fetch(`${Api_Link}/bets/${id}`, 
            {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error('ошибка обноления');
            return await res.json();
        } 
        catch (e) 
        {
            console.error('не удалось обновить ставку:', e);
            return null;
        }
    },

    async deleteBet(id) 
    {
        try 
        {
            const res = await fetch(`${Api_Link}/bets/${id}`, {method: 'DELETE'});
            return res.ok;
        } 
        catch (e) 
        {
            console.error('не удалось удалить ставку:', e);
            return false;
        }
    }
};