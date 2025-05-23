import UserSelector from '../../components/UserSelector';
import { FiInfo } from 'react-icons/fi';
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

export const metadata = {
  title: 'Kullanıcı Seçimi - Reconus',
  description: 'Kişiselleştirilmiş ürün önerileri için kullanıcı seçin',
};

export default function UsersPage() {
  return (
    <div className="container mx-auto py-4">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold mb-3 relative inline-block">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
            Kullanıcı Seçimi
          </span>
          <span className="absolute inset-0 blur-xl opacity-40 bg-gradient-to-r from-cyan-300 to-cyan-500 rounded-full"></span>
        </h1>
        <p className="text-gray-400 text-lg">
          Kişiselleştirilmiş ürün önerileri görmek için bir kullanıcı seçin
        </p>
      </div>
      
      <UserSelector />
      
      <div className="mt-8 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <div className="flex items-center mb-2">
          <FiInfo className="h-5 w-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Sistem Bilgisi</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Bu sayfa Supabase veritabanındaki kullanıcıları listeler. Bir kullanıcı seçildiğinde, sistem önerilen ürünleri getirir.
        </p>
      </div>
    </div>
  );
} 