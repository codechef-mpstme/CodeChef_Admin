import { useEffect, useState } from "react";
import Router from "next/router";
import NavCustom from '../lib/components/NavCustom';
import Header from "../lib/components/Header";
import { Card, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { storage } from "../lib/firebase";
import { ref,deleteObject,uploadBytes } from "firebase/storage";
import axios from "axios";

export default function Dashboard()
{
    const [isUser,setIsUser] = useState(false);
    const [image, setImage] = useState(null);
    const [events, setEvents] = useState([]);
    const [isEditing, setIsEditing] = useState(-1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [venue, setVenue] = useState('');
    const [timestamp, setTimestamp] = useState();
    function getEvents()
    {
        fetch(`${window.location.origin}/api/getEvents`)
            .then(res => res.json())
            .then(data => setEvents(data));
    }
    useEffect(() =>
    {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user)
        {
            setIsUser(true);
            getEvents();    
        }
        else
        {
            setIsUser(false);
            Router.push('/');
        }
    }, []);

    useEffect(() =>
    {
        if (isEditing !== -1)
        {
            setDescription(events[isEditing].description);
            setName(events[isEditing].name);
            setVenue(events[isEditing].venue);
            setTimestamp(events[isEditing].timestamp);
        }
    }, [isEditing]);
    async function handleDelete(index)
    {
        const confirm = window.confirm("Are you sure you want to delete this event?");
        if (confirm)
        {
            const res = await axios.post(`${window.location.origin}/api/deleteEvent`, { name: events[index].name });
            if (res.status === 200)
            {
                getEvents();
                alert("Event deleted successfully");
            }
            else
            {
                alert("Error deleting event");
            }
        }
        else
        {
            alert("Event not deleted");
        }
    }
    async function handleEdit(index)
    {
        const date = new Date(timestamp);
        const oldDate = new Date(events[index].timestamp.seconds * 1000);
        console.log(date, oldDate);
        if (events[index].name === name && events[index].description === description && events[index].venue === venue && oldDate.getTime() === date.getTime() && image === null)
        {
            alert("No changes made");
        }
        else if (image === null)
        {
            alert("Please select an image");
        }
        else
        {
            const confirm = window.confirm("Are you sure you want to edit this event?");
            if (confirm)
            {
                try
                {
                    const domain = new URL(window.location.href).hostname;
                    const protocol = new URL(window.location.href).protocol;
                    const docId = await axios.post(`${window.location.origin}/api/getDocId`, { name: events[index].name });
                    await uploadBytes(ref(storage, `events/${docId.data}.png`), image, { contentType: "image/png" });
                    const changeI = image ? "true": "false";
                    const res = await axios.post(`${window.location.origin}/api/editEvent`, {
                        name: name,
                        description: description,
                        venue: venue,
                        timestamp: date,
                        oldTitle: events[index].name,
                        changeFields: 'true',
                        changeImage: changeI
                    });
                    if (res.status === 200)
                    {
                        getEvents();
                        setIsEditing(-1);
                        alert("Event edited successfully");
                    }
                }
                catch (e)
                {
                    console.log(e);
                }
            }
            else
            {
                alert("Event not edited");
                setDescription(events[index].description);
                setName(events[index].name);
                setVenue(events[index].venue);
                setTimestamp(events[index].timestamp);
            }
        }
    }
    
    const to_render = (
        <>
            <Header />
            <NavCustom isDashBoard={true} isUser={true} />
            <h1>Dashboard</h1>
            <div className="dashboard-container">
                {
                    events.map((event, index) =>
                    (
                        <Card key={index} className="inline" style={{ width: '15rem', display: 'inline-block' }}>
                            {isEditing === index ?
                                <input type='file' onChange={(e) => { setImage(e.target.files[0]) }} />
                                : <Card.Img variant="top" src={event.image} />}
                            <Card.Body>
                                {isEditing == index ?
                                    <input type="text" placeholder={event.name} onChange={(e) => setName(e.target.value)} />
                                    : <Card.Title>{event.name}</Card.Title>}

                                {isEditing == index ?
                                    <textarea type="text" placeholder={event.description} onChange={(e) => setDescription(e.target.value)} />
                                    : <Card.Text>{event.description}</Card.Text>}
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                {isEditing == index ?
                                    <input type='datetime-local' onChange={(e) => setTimestamp(e.target.value)} />
                                    //logic to show time feel free to change
                                    : <ListGroupItem>{new Date(event.timestamp.seconds * 1000).getDate()}/{new Date(event.timestamp.seconds * 1000).getMonth() + 1}/{new Date(event.timestamp.seconds * 1000).getFullYear()} {new Date(event.timestamp.seconds * 1000).getHours()}:{new Date(event.timestamp.seconds * 1000).getMinutes()}</ListGroupItem>}

                                {isEditing == index ?
                                    <input type="text" placeholder={event.venue} onChange={(e) => setVenue(e.target.value)} />
                                    : <ListGroupItem>{event.venue}</ListGroupItem>}
                            </ListGroup>
                            <Card.Body>
                                {isEditing !== index ?
                                    <Button varint='primary' className='button' onClick={() => setIsEditing(index)}>Edit</Button> : <Button variant='primary' className='button' onClick={() => setIsEditing(-1)}>Cancel</Button>}
                                {isEditing == index ?
                                    <Button className='button' onClick={() => handleEdit(index)} variant="success">Save</Button> : null}
                                <Button className='button' onClick={() => handleDelete(index)} variant="danger">Delete</Button>
                            </Card.Body>
                        </Card>
                    ))
                }
            </div>
        </>
    );

    return (isUser ? to_render : null);
}