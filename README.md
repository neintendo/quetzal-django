# quetzal.

A minimalist personal finance manager built with JavaScript & Python. It allows the user to manage & visualise transactions in multiple currencies with built-in authentication & support for multiple users.

![Electron.js](https://img.shields.io/badge/Electron-%23191970.svg?style=for-the-badge&logo=Electron&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

| Light | Dark |
|-------|------|
| <img src="images/quetzal_screenshot_light.jpeg" width="100%" alt="Light mode" /> | <img src="images/quetzal_screenshot_dark.jpeg" width="100%" alt="Dark mode" /> |

## features.

- Token-based user authentication with registration/login/logout.
- Record income, expenses & transfers between accounts.
- User-defined account types e.g. bank, cash or investments
- Customizable income/expense categories.
- Track finances in over 150 currencies with automatic conversion.
- Filter transactions by specific date ranges.
- Visualise aggregate income, expenses & net worth.
- Export transaction data to CSV.

## installation.

*check release tab for platform specific builds.*

### for developers.

**Prerequisites**: Python 3.10+, pip3, npm

```sh
# 1. clone the repository.
git clone https://github.com/neintendo/quetzal.git
cd quetzal

# 2. create & switch to a virtual environment.

# 3. install backend dependencies.
pip3 install -r requirements.txt

# 4. build python installer (for electron).
pyinstaller quetzal_django.spec

# 5. build & package application into electron.
cd quetzal_react
npm install
npm run build
npm run package

# after packaging, the executable is located in /quetzal_react/out
```
