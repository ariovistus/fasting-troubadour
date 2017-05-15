

rm src/plugins/fasting-troubadour -recurse
if(test-path src/plugins/src) {
    rm src/plugins/src -recurse
}
mkdir src/plugins/fasting-troubadour
mkdir src/plugins/src
cp ../dist/* src/plugins/fasting-troubadour
cp ../src/* src/plugins/src/

# rm -f src/plugins/fasting-troubadour/*.html
# rm -f src/plugins/fasting-troubadour/*.js
