import { redirect } from 'next/navigation';

export default function Home() {
  // This instantly forwards anyone visiting the root URL to the admin folder
  redirect('/admin');
}