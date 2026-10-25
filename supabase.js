// استيراد المكتبة عبر رابط CDN مباشر
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://xhyjhsyqkhewcwugvgpx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoeWpoc3lxa2hld2N3dWd2Z3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzODQ5ODksImV4cCI6MjEwNzk2MDk4OX0.QJ4aLcj89NgN20hdHNGg3nkjo1drz5m34wUqSRQMv7A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);