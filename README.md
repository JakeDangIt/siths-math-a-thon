# Math-a-thon 2025

![GitHub License](https://img.shields.io/github/license/jakedangit/siths-math-a-thon)
![GitHub Repo stars](https://img.shields.io/github/stars/jakedangit/siths-math-a-thon)
![GitHub watchers](https://img.shields.io/github/watchers/jakedangit/siths-math-a-thon)

> You're on the Math Team? What a nerd.

If you're reading this, you're in a very niche intersection of fields:

- Mathematics
- Computer Science
- Web Design
- and whatever other nerd subjects you can think of.

Welcome to the Staten Island Technical High School Math-a-thon 2025 repository! I hope this README allows you to more easily understand the code I've written. But for some context, the Math-a-thon is a school-wide math competition where more questions right means more points and more points means closer to winning. Every week, 20 questions are released, alongside 12 bonus questions, increasing in difficulty as you go until the last 3rd week. This website aims to digitize the whole process, making it easier on the Math Team and the competition's participants and hopefully gaining more users.

## Creator + Maintainer: [Jake J. Deng](https://github.com/JakeDangIt), class of 2025

- Email: <jakejdeng@gmail.com>
- [Instagram](https://www.instagram.com/jakedangit/)
- [LinkedIn](https://www.linkedin.com/in/jake-deng-905229322/)

### About the Web App

> What if we just didn't use paper anymore?

I realized that this competition could be graded so much easier if I made it a website. <br>
Things got a little out of hand from there...

## Demos

Coming soon...

### Features

- User registration and authentication
- Automatic grading of Math-a-thon submissions
- Leaderboard of top scorers
- Real-time data display and updates
- User profile management (including custom avatars!)

### Goals

- Advertise the competition and appeal to the student body
- Organize and streamline student participation

### Installation + Contributions

1. Open the repo in your IDE
2. Set up Supabase project and create .env file with your key and url.

```
SUPABASE_URL = <insert_url>
SUPABASE_KEY = <insert_key>
```

3. Install dependencies and run development server

```
> npm i
> npm run dev
```

4. Commit and create a pull request.
5. Wait for it to be pushed.

### Main Structure and Services I've Used

- Framework: Nuxt 3

I started off using vanilla Vue and eventually switched to Nuxt for the SSR and better SEO and autoimports.

- Domain Name and Website Hosting: Namecheap, Vercel, MailerSend

I host the website on Vercel. Just make sure that you have the environment variables.
I wanted to buy a nice domain for the website, siths-mathathon.com, which, in hindsight, isn't the most prettiest name, and I bought it for like **$6** on Namecheap for 2 years. <br>
I also bought the email service for a free trial that comes along with it, called PrivateEmail, and allows me to use it for SMTP purposes, which brings me to the next point. <br>
I now am using a free one since I really don't need that much of a rate limit, MailerSend.

- Authentication and Database: Supabase

Supabase requires an SMTP to send more than 3 emails an hour, which is highly beneficial when you need like a hundred kids to signup. Supabase is also handy for the data handling of the students' answers, except for the usage of their public functions, which has forced me to call those functions to check and update answers manually. I also use Supabase to host the avatars of users, contact form submissions, and the answer key (shhh). <br>

- Questions: Sanity CMS

I host the questions on Sanity, which allows me to implement an add question feature on the website itself, instead of me inputting the questions manually. Taking the user uid and matching it to the profile allows me to check their role and allow them to have the add question button.

- Spreadsheets: Google Sheets

Unfortunately, the general-ness of the Math Team does not use software like Supabase, instead opting for the more basic Google Sheets to handle the data. Previously, that's how it's always been done, with papers being graded and then inputed on the spreadsheet. <br>
In 2024, instead of sending the data to Supabase, I sent it to the sheet using Google's API (which was a huge pain) and used the Google formulas to check and validate that data.
It was a very huge mess, having to share it with other members and them changing my formulas, and overwriting data on accident, prompting me to have to email all the participants (a plus side to using Supabase auth) and have them resubmit. <br>
Hopefully for 2025, I am sticking to Supabase, and if they need the data, I'll send it to them or input it myself on the sheet.

- Important modules/plugins: [Pinia](https://pinia.vuejs.org/ssr/nuxt.html), [TailwindCSS](https://tailwindcss.com/docs/guides/nuxtjs), [ShadCN](https://www.shadcn-vue.com/), [Icons](https://nuxt.com/modules/icon)

Not a crazy list, but there are others that I used in some small parts (IDK if that's good for performance). <br>
I extensively use the Vue port of the ShadCN component library, built off of radix-vue, for most of the components, as well as Tailwind CSS to style. And I also use the gravity-ui icons for things like the links on the navigation menu for mobile screens. <br>
Pinia stores are there to share data, usually data that has to be fetched, amongst components.

### Authentication

Very simply, I set up the Supabase client in the Nuxt app using the [Nuxt + Supabase library](https://supabase.nuxtjs.org/). <br>
For 2025 specifically, and for all future references to code unless I have redesigned the whole website again, in `math-a-thon-25\components\auth\AccountTabs.vue`, you basically just log in and sign up here. If you log in or click the link in your email after you sign up, you get redirected to your profile. <br>
There is very necessary information to be kept about each user, so the dialog in the sign up process is crucial. <br>
Profile data is uploaded too.

### Profile + Avatar

Unfortunately, I spent a long time figuring out this feature, but eventually I got it. <br>
To put it very briefly, you can update your user data and upload an avatar, of which you crop yourself. <br>
Might be best to just leave this stuff alone since I'm not too confident in changing it. It was very hard adding the cropper library, converting the canvas to images, figuring out how to update it on the app and on the DB, etc.

### Questions + Answers

The questions will be written in LaTeX and be typeset by MathJax. MathJax will be inserted as a script when the questions page is mounted, alongside fetching the question data and making cards for each one. Once the content is loaded, it typesets. <br>
You can also change weeks/bonuses on the carousel, with the questions just being filtered by week name. <br>
Save whenever, submit every hour, just uploads the uid, time, and answers (as jsonb). <br>
There's also a scroll down button and remove input buttons. <br>
If you have the appropriate role, you can add/edit the questions.

### Leaderboard

Top 3, top 10, and your own answers. <br>
But, only top 3 deserves their avatar shown.

### Staff

Just all the people working on it, but it's just me rn.

### Archive

Fetch the file data, and then it just becomes links that opens up the .pdf files.

### Contact Us

Form with name and email autofilled if you're logged in.

### Acknowledgments

Special thanks to Mr. Whalen for indirectly teaching me the basics of Vue.js, and to the Math Team members and CS students (Bridget Feng and Andrea Guo) for helping with testing and designing the early versions of the app.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
