import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL: string = import.meta.env.VITE_API_URL;// || 'http://localhost:8000';

function App() {
    const [message, setMessage] = useState<string>('');
    console.log(API_URL);

    useEffect(() => {
        axios.get(`${API_URL}/`)
            .then(response => setMessage(response.data))
            .catch(error => console.error(error));
    }, []);

    return <h1>{message}</h1>;
}

export default App;