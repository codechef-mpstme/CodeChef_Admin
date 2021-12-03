import { useState, useEffect } from 'react';
import NavCustom from '../lib/components/NavCustom';
import { useRouter } from 'next/router';
import { storage,auth } from '../lib/firebase'
import { ref,uploadBytes } from 'firebase/storage' 
import axios from 'axios';
import Header from '../lib/components/Header';

export default function Add()
{
    const router = useRouter();
    const [isUser,setIsUser] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState();
    const [venue, setVenue] = useState('');
    const [Image, setImage] = useState();
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user)
        {
            setIsUser(true);    
        }
        else
        {
            window.location.href = `${window.location.origin}/`;
        }
    }, [])
    async function handleSubmit(event)
    {
        event.preventDefault();
        const date1 = new Date(date);
        try
        {
            const domain = new URL(window.location.href).hostname;
            const protocol = new URL(window.location.href).protocol;
            const res = await axios.post(`${window.location.origin}/api/addEvent`, { "name": title, "description": description, "venue": venue, timestamp: date1 });
            if (res.status === 200)
            {
                if (Image)
                {
                    const fileRes = await axios.post(`${window.location.origin}/api/getDocId`, { 'name': title });
                    if (fileRes.status === 200)
                    {
                        await uploadBytes(ref(storage, `events/${fileRes.data}.png`), Image,{ contentType: 'image/png' });
                        const response = await axios.post(`${window.location.origin}/api/editEvent`, {
                            'oldTitle': title,
                            'changeImage': 'true',
                            'changeFields': 'false'
                        })
                        if (response.status !== 200)
                        {
                            alert('Error in uploading image');
                        }
                    }
                }
                alert("Event added successfully");
            }

        }
        catch (e)
        {
            alert("Error in adding event");
            console.log(e.response.data);
        }
    }
    const to_return = (
        <>
            <Header />
            <NavCustom isDashboard={false} isUser={isUser} />
            <div className="add-page">
                <h1>Add Event</h1>
                <form onSubmit={handleSubmit}>
                    <label>Event Name</label>
                    <input type="text" name="name" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />

                    <label>Event Date</label>
                    <input type="datetime-local" name="date" placeholder="Date" onChange={(e) => setDate(e.target.value)} />

                    <label>Event Description</label>
                    <textarea type="text" name="description" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />

                    <label>Event Venue</label>
                    <input type="text" name="venue" placeholder="Venue" onChange={(e) => setVenue(e.target.value)} />

                    <label>Display Image</label>
                    <input type="file" name="image" placeholder="Image" onChange={(e) => setImage(e.target.files[0])} />

                    <button className="submit" type="submit">Submit</button>
                </form>
            </div>
        </> 
            );
    return ( isUser && to_return );
}
