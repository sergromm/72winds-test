<h1 align="center">Тестовое задание для 7winds</h1> <br>

- [Vercel deploy][vercel] (не работает из-за Mixed Content)

## Запуск проекта локально:

`npm run dev`

## Что использовал из дополнительных библиотек:

1. MUI - для компонентов.
2. Jotai - для упровления состояниме клиента.
3. React-Query - использовать для синхронизации состояний, не вышло.
4. Vite - сборщик.

## Известные баги и не слишком хороший код:

1. Файлы могут быть только третьего уровня вложенности. В остальных случаях создаётся папка.
2. Для добавления новых строк используются очень похожие функции, не удалось свести к одной. Поэтому код повторяется.
3. Не совсем уверен что после запроса на обновление данные обновляются как нужно. Например, при занулении поля,  
   не перерасчитываются значения родительских колонок.

## Что можно улучшить:

1. Добавить валидацию для инпутов.
2. Добавить анимацию при удалении и добавлении столбцов.

## Итог:

Ещё не доводилось делать рекурсивные UI компоненты, было очень интересно и местами сложно. Кажется вставил себе палки в колёса, выбрав библиотеки с которыми ещё не работал. Менять стили MUI было болезненно и не смог воспользоваться Jotai в полной мере. Спасибо за уделённое время, полезный опыт и интересное задание. 😌

[vercel]: https://72winds-test.vercel.app/
