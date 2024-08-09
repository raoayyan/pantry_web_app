import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const collectionRef = collection(db, 'pantry');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const snapshot = await getDocs(collectionRef);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  } else if (req.method === 'POST') {
    try {
      const newItem = req.body;
      const docRef = await addDoc(collectionRef, newItem);
      res.status(201).json({ id: docRef.id, ...newItem });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add item' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const docRef = doc(db, 'pantry', id as string);
      await deleteDoc(docRef);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
