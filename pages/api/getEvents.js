import { db } from '../../lib/firebase'
import { query,getDocs,collection } from 'firebase/firestore';
export default async function handler(req, res)
{
    const q = query(collection(db,'events'));
    const data = await getDocs(q);
    const events = data.docs.map(doc => doc.data());
    res.status(200).json(events);
}