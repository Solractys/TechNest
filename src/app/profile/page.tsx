'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setImage(session.user.image || '');
    }
  }, [session]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar perfil');
      }
      
      setSuccessMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      
      // Update session
      router.refresh();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao atualizar o perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-800 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 bg-green-50 text-green-800 p-4 rounded-md">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
              {image ? (
                <Image
                  src={image}
                  alt={name || 'Profile picture'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary-100">
                  <span className="text-primary-700 text-2xl font-medium">
                    {(name?.charAt(0) || session?.user?.email?.charAt(0) || 'U').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(session?.user?.name || '');
                      }}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{session?.user?.name || 'Usuário'}</h2>
                  <p className="text-gray-600">{session?.user?.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar Perfil
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Informações da conta</h3>
            <div className="space-y-3">
              <p className="flex justify-between text-sm">
                <span className="text-gray-500">Função:</span>
                <span className="font-medium">{session?.user?.role === 'ADMIN' ? 'Administrador' : session?.user?.role === 'ORGANIZER' ? 'Organizador' : 'Usuário'}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="text-gray-500">Método de login:</span>
                <span className="font-medium">{image ? (image.includes('github') ? 'GitHub' : image.includes('google') ? 'Google' : 'Email') : 'Email'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Eventos de interesse</h3>
          <p className="text-gray-600 text-sm italic">Você ainda não mostrou interesse em nenhum evento.</p>
          {/* In a real app, we'd fetch and display events the user is interested in */}
        </div>
      </div>
    </div>
  );
}