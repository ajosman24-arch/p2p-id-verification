console.log("🔥 السكربت بدأ العمل الآن!");
import { supabase } from './supabase.js'

async function testInsert() {
  const { data, error } = await supabase
    .from('contacts')
    .insert([
      {
        password: 'John Doe',
        email: 'john@example.com'
      }
    ])

  if (error) {
    alert('Error: ' + error.message)
    console.error(error)
  } else {
    alert('Data saved!')
    console.log(data)
  }
}

testInsert()