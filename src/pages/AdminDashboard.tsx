import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarCheck, Trash2, LogIn, LogOut, Plus, Shield, Pencil } from 'lucide-react';
import { calculateAvailableHours } from '@/lib/timeSlots';

interface BookingRow {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  customer_name: string | null;
  customer_email: string | null;
  notes: string | null;
  owner_id: string | null;
  owner_name: string | null;
}

const AdminDashboard = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchBookings();
  }, [session]);

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('date', { ascending: true });
    if (data) setBookings(data as BookingRow[]);
  };

  const getBalanceHoursForDate = (date: string): number => {
    const dateBookings = bookings.filter(b => b.date === date);
    const slots = dateBookings.map(b => ({
      start_time: b.start_time,
      end_time: b.end_time
    }));
    return calculateAvailableHours(slots);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    else toast.success('Logged in!');
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setCustomerName('');
    setCustomerEmail('');
    setNotes('');
    setStartTime('');
    setEndTime('');
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (!startTime || !endTime) {
      toast.error('Please set both start and end times');
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const payload = {
      date: dateStr,
      start_time: startTime,
      end_time: endTime,
      customer_name: customerName || null,
      customer_email: customerEmail || null,
      notes: notes || null,
    };

    if (editingId) {
      const { error } = await supabase.from('bookings').update(payload).eq('id', editingId);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Booking updated!');
        resetForm();
        fetchBookings();
      }
      return;
    }

    const { error } = await supabase.from('bookings').insert({
      ...payload,
      owner_id: session?.user?.id,
      owner_name: session?.user?.email,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Booking created!');
      resetForm();
      fetchBookings();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Booking removed');
      if (id === editingId) resetForm();
      fetchBookings();
    }
  };

  const handleEdit = (row: BookingRow) => {
    setEditingId(row.id);
    setSelectedDate(new Date(row.date + 'T00:00:00'));
    setCustomerName(row.customer_name || '');
    setCustomerEmail(row.customer_email || '');
    setNotes(row.notes || '');
    setStartTime(row.start_time || '');
    setEndTime(row.end_time || '');
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass-card p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Shield className="w-10 h-10 text-primary mx-auto mb-2" />
            <h1 className="font-display text-2xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Sikara Mahal - Admin Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="admin@example.com" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Password</label>
              <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1" />
            </div>
            <Button type="submit" className="w-full gradient-violet text-primary-foreground" disabled={loading}>
              <LogIn className="w-4 h-4 mr-2" /> {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Sikara Mahal
            </span>
            <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Owner Dashboard</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </nav>

      <div className="container max-w-4xl mx-auto py-10 px-4">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-primary" /> Manage Bookings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add booking */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Create Booking</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-3 pointer-events-auto mb-4"
              modifiers={{ booked: bookings.map(b => new Date(b.date + 'T00:00:00')) }}
              modifiersStyles={{
                booked: { backgroundColor: '#a78bfa', color: '#fff', fontWeight: 'bold' },
              }}
            />
            <div className="flex gap-3 mt-2 text-xs mb-4">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}></span> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: '#a78bfa', borderColor: '#a78bfa' }}></span> Already Booked
              </span>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">Start Time</label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">End Time</label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Customer Name</label>
                <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="John Doe" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Customer Email</label>
                <Input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="john@example.com" className="mt-1" />
              </div>
              <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={handleSave} className="flex-1 gradient-violet text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" /> {editingId ? 'Update Booking' : 'Create Booking'}
                </Button>
                {editingId && (
                  <Button variant="outline" size="sm" onClick={handleCancelEdit} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Bookings list */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">
              Bookings ({bookings.length})
            </h3>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No bookings yet.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-3 rounded-lg border-2" style={{ borderColor: '#a78bfa', backgroundColor: '#f3e8ff' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm" style={{ color: '#7c3aed' }}>
                            {format(new Date(booking.date + 'T00:00:00'), 'PPP')}
                          </p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#a78bfa', color: '#fff' }}>
                            Already Booked
                          </span>
                        </div>
                        <p className="text-xs text-purple-600 font-semibold mt-1">
                          ⏰ {booking.start_time} - {booking.end_time}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          💰 Balance Hours: {getBalanceHoursForDate(booking.date)} hrs
                        </p>
                        {booking.customer_name && (
                          <p className="text-xs text-purple-700 mt-1">👤 {booking.customer_name}</p>
                        )}
                        {booking.notes && <p className="text-xs text-purple-700 mt-1">📝 {booking.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(booking)} className="text-primary hover:text-primary-foreground">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(booking.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
