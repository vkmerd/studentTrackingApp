const SUPABASE_URL = 'https://kyezpvmrsrnteipljzrg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZXpwdm1yc3JudGVpcGxqenJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDg5OTM1MiwiZXhwIjoyMDMwNDc1MzUyfQ.1KcaEbtcnx3pH8e_wGjdCy2W6gavwvvIjd8ewWbuXvo'

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)   
const registerForm = document.querySelector("#registerForm")
console.log(_supabase);
    const tabs = document.querySelectorAll('.tabs .button');
    const contents = document.querySelectorAll('.tabs-content .content');
const registersList = document.querySelector(".registersList")
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-id');

            contents.forEach(content => {
                content.style.display = 'none';
            });

            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.display = 'block';
            }
        });
    });

    if (tabs.length > 0) {
        tabs[0].click();
    }

    async function registerConnect(e) {
        e.preventDefault(); 
    
        const formData = new FormData(this);
        const formObject = {};
    
        for (const [key, value] of formData.entries()) {
            formObject[key] = value;
        }
    
        const selectedLesson = document.querySelector('#classLesson');
        const selectedOption = selectedLesson.options[selectedLesson.selectedIndex];
        formObject['selectedLessonValue'] = selectedOption.value; 
    
        try {
            const { data, error } = await _supabase
        .from('students')
        .insert([
            {
                student_name: formObject.student_name,
                student_surname: formObject.student_surname,
                stemail_address: formObject.stemail_address,
                student_id: formObject.student_id,
                selectedLessonValue: formObject.selectedLessonValue 
            }
        ]);
    
            if (error) throw error;
            console.log('Kayıt başarılı:', data);
            
        } catch (error) {
            console.error('Kayıt hatası:', error.message);
        }
    
        registerForm.reset();
    
        registersList.innerHTML += `
        <p>${formObject['stemail_address']}</p>`;
        return;
    }
    
    
registerForm.addEventListener('submit', registerConnect)

