import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarCheck, Trash2, LogIn, LogOut, Plus, Shield } from 'lucide-react';

interface AvailabilityRow {
  id: string;
  date: string;
  status: string;
  note: string | null;
}

const AdminDashboard = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<AvailabilityRow[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'booked' | 'blocked'>('booked');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchDates();
  }, [session]);

  const fetchDates = async () => {
    const { data } = await supabase.from('availability').select('*').order('date', { ascending: true });
    if (data) setDates(data as AvailabilityRow[]);
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

  const handleAddDate = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { error } = await supabase.from('availability').insert({
      date: dateStr,
      status,
      note: note || null,
    });
    if (error) {
      if (error.code === '23505') toast.error('This date is already added');
      else toast.error(error.message);
    } else {
      toast.success('Date added!');
      setSelectedDate(undefined);
      setNote('');
      fetchDates();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('availability').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Date removed');
      fetchDates();
    }
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

  const bookedDates = dates.map(d => new Date(d.date + 'T00:00:00'));

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
          <CalendarCheck className="w-6 h-6 text-primary" /> Manage Availability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add date */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Block / Mark Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-3 pointer-events-auto mb-4"
              modifiers={{ booked: bookedDates }}
              modifiersStyles={{
                booked: { backgroundColor: 'hsl(0 84.2% 60.2% / 0.2)', color: 'hsl(0 84.2% 60.2%)' },
              }}
            />
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={status === 'booked' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatus('booked')}
                  className={status === 'booked' ? 'gradient-violet text-primary-foreground' : ''}
                >
                  Booked
                </Button>
                <Button
                  variant={status === 'blocked' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatus('blocked')}
                  className={status === 'blocked' ? 'gradient-violet text-primary-foreground' : ''}
                >
                  Blocked
                </Button>
              </div>
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note (e.g., Customer name)" />
              <Button onClick={handleAddDate} className="w-full gradient-violet text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" /> Add Date
              </Button>
            </div>
          </div>

          {/* Date list */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">
              Booked / Blocked Dates ({dates.length})
            </h3>
            {dates.length === 0 ? (
              <p className="text-muted-foreground text-sm">No dates added yet.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {dates.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {format(new Date(d.date + 'T00:00:00'), 'PPP')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          d.status === 'booked'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {d.status}
                        </span>
                        {d.note && <span className="text-xs text-muted-foreground">{d.note}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
