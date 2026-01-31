import os

# Путь к вашему файлу со звуками.
# Проверьте, что путь правильный! (Обычно это src/Components/soundPath.js)
file_path = 'src/Components/soundPath.js'

def fix_file():
    if not os.path.exists(file_path):
        print(f"❌ Ошибка: Файл {file_path} не найден!")
        print("Убедитесь, что вы положили этот скрипт в корень проекта WordHunt.")
        return

    # Читаем файл
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Делаем замену: ищем 'assets/www/' и меняем на 'assets/'
    # Это сработает и для us, и для uk, и для любых других файлов внутри
    new_content = content.replace('assets/www/', 'assets/')

    # Если изменений нет, сообщаем об этом
    if content == new_content:
        print("ℹ️ В файле не найдено строк с 'assets/www/'. Возможно, он уже исправлен.")
        return

    # Сохраняем обратно
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✅ Готово! Файл {file_path} успешно обновлен.")
    print("Удалено 'www/' из всех путей.")

if __name__ == '__main__':
    fix_file()