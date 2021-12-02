import { db,storage } from '../../lib/firebase';
import { addDoc, collection, Timestamp,query,where,getDocs } from 'firebase/firestore';
import { getDownloadURL,ref } from '@firebase/storage';

export default async function handler(req, res)
{
    const doc = await addDoc(collection(db, 'events'), {
        name: req.body.name,
        description: req.body.description,
        venue: req.body.venue,
        timestamp: Timestamp.fromDate(new Date(req.body.timestamp))
    });
    res.status(200).json(doc.id);
}