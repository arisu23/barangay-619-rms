import React from 'react';
import { Official } from '../types';

const officials: Official[] = [
  { id: '1', name: 'Hon. Michael King Cajucom', role: 'Chairman', imageUrl: 'https://picsum.photos/100/100?random=1' },
  { id: '2', name: 'Hon. Reynaldo T. Maca', role: 'Secretary', imageUrl: 'https://picsum.photos/100/100?random=2' },
  { id: '3', name: 'Hon. Jean L. Limpahan', role: 'Treasurer', imageUrl: 'https://picsum.photos/100/100?random=3' },
  { id: '4', name: 'Hon. Laila D. Galvez', role: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=4' },
  { id: '5', name: 'Hon. Bladdy Mair F. Cambaliza', role: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=5' },
  { id: '6', name: 'Hon. Maricel S. Bustillo', role: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=6' },
  { id: '7', name: 'Hon. Diego B. Padua', role: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=7' },
  { id: '8', name: 'Hon. Conrado S. Marquez Jr.', role: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=8' },
  { id: '9', name: 'Hon. Manuel V. Abolencia', role: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=9' },
  { id: '10', name: 'Hon. Loyola T. Cochon', role: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=10' },
];

const OfficialsList: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      {/* Header Card */}
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center space-x-4">
        <img 
            src="https://media.discordapp.net/attachments/1438161259462787073/1439120214435561483/att.g_4t85zYhMdID5Q6sk8PT3DHrEtdAnWmgwuz9b1ET8k.jpg?ex=695deaa4&is=695c9924&hm=b446d732ad70181d19028d66a3dd7edc1bfc9bb3cf5b2da530a7cc11f6775a65&=&format=webp&width=519&height=519" 
            alt="Barangay 619 Logo" 
            className="w-12 h-12 drop-shadow-sm rounded-full" 
        />
        <div>
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Barangay 619 Zone 62</p>
            <h3 className="font-bold text-gray-800 text-xl">Officials</h3>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {officials.map((official) => (
          <div key={official.id} className="flex flex-col p-3 rounded-lg hover:bg-gray-50 transition-colors">
             <span className="text-xs text-blue-600 font-bold uppercase mb-1">{official.role}</span>
             <h4 className="text-sm font-medium text-gray-800">{official.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficialsList;