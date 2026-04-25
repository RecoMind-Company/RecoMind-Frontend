// get user authentication status

export function getUser(id) {
    const res = fetch(`https://api.example.com/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res;
    
}