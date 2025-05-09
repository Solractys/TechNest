'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string | null;
  location: string;
  address?: string | null;
  city: string;
  state: string;
  online: boolean;
  meetingUrl?: string | null;
  imageUrl?: string | null;
  website?: string | null;
  maxAttendees?: number | null;
  price?: number | null;
  published: boolean;
  categories: { id: string; name: string; slug: string }[];
}

export default function EditEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [online, setOnline] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [maxAttendees, setMaxAttendees] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [published, setPublished] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [eventId, setEventId] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  // Fetch event data and categories
  useEffect(() => {
    if (status === 'authenticated' && slug) {
      const fetchEventAndCategories = async () => {
        try {
          setFetchingEvent(true);
          // Fetch event data
          const eventResponse = await fetch(`/api/events/${slug}`);
          
          if (!eventResponse.ok) {
            if (eventResponse.status === 404) {
              throw new Error('Evento não encontrado');
            } else if (eventResponse.status === 403) {
              throw new Error('Você não tem permissão para editar este evento');
            } else {
              throw new Error('Erro ao carregar o evento');
            }
          }
          
          const eventData: EventData = await eventResponse.json();
          
          // Set event data in form
          setEventId(eventData.id);
          setTitle(eventData.title);
          setDescription(eventData.description);
          
          // Format date and time
          const eventDate = new Date(eventData.date);
          setDate(eventDate.toISOString().split('T')[0]);
          setTime(eventDate.toISOString().split('T')[1].substring(0, 5));
          
          if (eventData.endDate) {
            const eventEndDate = new Date(eventData.endDate);
            setEndDate(eventEndDate.toISOString().split('T')[0]);
            setEndTime(eventEndDate.toISOString().split('T')[1].substring(0, 5));
          }
          
          setOnline(eventData.online);
          setLocation(eventData.online ? '' : eventData.location);
          setAddress(eventData.address || '');
          setCity(eventData.city);
          setState(eventData.state);
          setMeetingUrl(eventData.meetingUrl || '');
          setImageUrl(eventData.imageUrl || '');
          setWebsite(eventData.website || '');
          setMaxAttendees(eventData.maxAttendees || '');
          setPrice(eventData.price || '');
          setPublished(eventData.published);
          
          // Set selected categories
          setSelectedCategories(eventData.categories.map(cat => cat.id));
          
          // Fetch categories
          setCategoriesLoading(true);
          const categoriesResponse = await fetch('/api/categories');
          
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            setCategories(categoriesData.categories);
          } else {
            throw new Error('Failed to load categories');
          }
          setCategoriesLoading(false);
          
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Ocorreu um erro ao carregar o evento');
          }
          console.error('Error fetching event:', err);
        } finally {
          setFetchingEvent(false);
        }
      };
      
      fetchEventAndCategories();
    }
  }, [status, slug]);

  // Preview image
  useEffect(() => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
    } else {
      // Default image
      setPreviewImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80');
    }
  }, [imageUrl]);

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;
    
    if (!title) {
      errors.title = 'O título do evento é obrigatório';
      isValid = false;
    }
    if (!description) {
      errors.description = 'A descrição do evento é obrigatória';
      isValid = false;
    }
    if (!date || !time) {
      errors.date = 'A data e hora do evento são obrigatórias';
      isValid = false;
    }
    if (online && !meetingUrl) {
      errors.meetingUrl = 'Para eventos online, o link da reunião é obrigatório';
      isValid = false;
    }
    if (!online && !location) {
      errors.location = 'Para eventos presenciais, o local é obrigatório';
      isValid = false;
    }
    if (selectedCategories.length === 0) {
      errors.categories = 'Selecione pelo menos uma categoria para o evento';
      isValid = false;
    }
    
    setValidationErrors(errors);
    
    if (!isValid) {
      setError('Por favor, corrija os campos destacados abaixo.');
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !eventId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const eventDateTime = new Date(`${date}T${time}`);
      const eventEndDateTime = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;
      
      const eventData = {
        id: eventId,
        title,
        description,
        date: eventDateTime.toISOString(),
        endDate: eventEndDateTime ? eventEndDateTime.toISOString() : null,
        location: online ? 'Online' : location,
        address: !online ? address : null,
        city,
        state,
        online,
        meetingUrl: online ? meetingUrl : null,
        imageUrl: imageUrl || null,
        website: website || null,
        maxAttendees: maxAttendees ? Number(maxAttendees) : null,
        price: price ? Number(price) : null,
        categories: selectedCategories,
        published,
      };
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar evento');
      }
      
      // Redirect to event page
      router.push(`/events/${data.slug}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao atualizar o evento');
      }
      console.error('Error updating event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || fetchingEvent) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Carregando evento...</p>
      </div>
    );
  }

  if (error === 'Evento não encontrado' || error === 'Você não tem permissão para editar este evento') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
        <Link
          href="/my-events"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Voltar para Meus Eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Editar Evento</h1>
        <p className="text-gray-600">Atualize as informações do seu evento</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título do Evento *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (validationErrors.title) {
                    setValidationErrors({...validationErrors, title: ''});
                  }
                }}
                className={`block w-full rounded-md shadow-sm focus:ring-primary-500 ${
                  validationErrors.title 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:border-primary-500'
                }`}
                placeholder="Ex: React São Paulo Meetup"
                required
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (validationErrors.description) {
                    setValidationErrors({...validationErrors, description: ''});
                  }
                }}
                rows={5}
                className={`block w-full rounded-md shadow-sm focus:ring-primary-500 ${
                  validationErrors.description 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:border-primary-500'
                }`}
                placeholder="Descreva seu evento em detalhes"
                required
              ></textarea>
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Forneça detalhes sobre o evento, palestrantes, agenda, etc.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Evento *
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (validationErrors.date) {
                      setValidationErrors({...validationErrors, date: ''});
                    }
                  }}
                  className={`block w-full rounded-md shadow-sm focus:ring-primary-500 ${
                    validationErrors.date 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-primary-500'
                  }`}
                  required
                />
                {validationErrors.date && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.date}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Início *
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Término
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Término
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Local</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <input
                  id="event-type-in-person"
                  name="event-type"
                  type="radio"
                  checked={!online}
                  onChange={() => setOnline(false)}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                />
                <label htmlFor="event-type-in-person" className="ml-3 block text-sm font-medium text-gray-700">
                  Evento Presencial
                </label>
              </div>
              <div className="flex items-center mb-6">
                <input
                  id="event-type-online"
                  name="event-type"
                  type="radio"
                  checked={online}
                  onChange={() => setOnline(true)}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                />
                <label htmlFor="event-type-online" className="ml-3 block text-sm font-medium text-gray-700">
                  Evento Online
                </label>
              </div>
            </div>
            
            {online ? (
              <div>
                <label htmlFor="meetingUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Link da Reunião *
                </label>
                <input
                  type="url"
                  id="meetingUrl"
                  value={meetingUrl}
                  onChange={(e) => {
                    setMeetingUrl(e.target.value);
                    if (validationErrors.meetingUrl) {
                      setValidationErrors({...validationErrors, meetingUrl: ''});
                    }
                  }}
                  className={`block w-full rounded-md shadow-sm focus:ring-primary-500 ${
                    validationErrors.meetingUrl 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="https://zoom.us/j/123456789"
                  required={online}
                />
                {validationErrors.meetingUrl && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.meetingUrl}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Link para a reunião online (Zoom, Google Meet, etc.)</p>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Local *
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (validationErrors.location) {
                        setValidationErrors({...validationErrors, location: ''});
                      }
                    }}
                    className={`block w-full rounded-md shadow-sm focus:ring-primary-500 ${
                      validationErrors.location 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Ex: Google for Startups Campus"
                    required={!online}
                  />
                  {validationErrors.location && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Ex: Rua Coronel Oscar Porto, 70"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Details Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Detalhes Adicionais</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem de Capa
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="mt-1 text-sm text-gray-500">URL de uma imagem que represente seu evento</p>
                </div>
                <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                  {previewImage && (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={() => setPreviewImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')}
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website do Evento
              </label>
              <input
                type="url"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="https://seu-evento.com.br"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de Participantes
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  min="1"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Deixe em branco se não houver limite"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="0.00 para eventos gratuitos"
                />
              </div>
            </div>
            
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Categorias *</p>
              <div className={`border rounded-md p-3 ${validationErrors.categories ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`category-${category.id}`}
                        name="categories"
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => {
                          handleCategoryChange(category.id);
                          if (validationErrors.categories) {
                            setValidationErrors({...validationErrors, categories: ''});
                          }
                        }}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-700">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {validationErrors.categories && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.categories}</p>
              )}
              {categoriesLoading ? (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-600"></div>
                  <p className="text-sm text-gray-500 italic">Carregando categorias...</p>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-red-500 italic mt-2">Nenhuma categoria disponível. Entre em contato com o administrador.</p>
              ) : null}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  checked={published}
                  onChange={() => setPublished(!published)}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm font-medium text-gray-700">
                  Evento publicado
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Desmarque esta opção para salvar como rascunho (não visível para o público).
              </p>
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/my-events"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}