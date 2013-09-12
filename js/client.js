$(function() {
    var deck = ["Andromeda", "Sure Gamble", "Aesop's Pawnshop", "Neural Katana", "Adonis Campaign", "Datasucker", "Beanstalk Royalties", "SanSan City Grid"];
    var suits = ["blue", "gray", "green", "red", "purple", "orange", "khaki", "yellow"];
    var imageIds = ["02083", "01050", "01047", "01077", "01056", "01008", "01098", "01092"];

    $document = $(document),
    $body = $(document.body),

    id = 0;

    CARD = "<div class=card><div class=text>",

    $board = $("#board");
    $board.droppable({
        drop: function(event, ui) {
            addToBoard(ui.draggable);
        },
        out: function(event, ui) {
            removeFromBoard(ui.draggable);
        }
    });

    $hand = $("#hand");
    $hand.droppable({
        drop: function(event, ui) {
            addToHand(ui.draggable);
        },
        out: function(event, ui) {
            removeFromHand(ui.draggable);
        }
    });

    $deck = $("#deck");
    $deck.droppable({
        drop: function(event, ui) {
            addToDeck(ui.draggable);
        },
        out: function(event, ui) {
            removeFromDeck(ui.draggable);
        }
    });

    $deckTop =  $deck.offset().top + 25;
    $deckLeft = $deck.offset().left + 8;

    function addToBoard(card) {
        card.addClass("on-board");
        if (card.attr("prev") == "hand") {
            $.notify("john plays '" + $(".text", card).html() + "'", "me");
        }
        if (card.attr("prev") == "deck") {
            $.notify("john plays '" + $(".text", card).html() + "' from top of his deck", "me");
        }
    }

    function removeFromBoard(card) {
        card.removeClass("on-board");
    }

    function addToDeck(card) {
        card.addClass("in-deck");
        if (card.attr("prev") == "board") {
            $.notify("john returns '" + $(".text", card).html() + "' to top of his deck", "me");
        }
        if (card.attr("prev") == "hand") {
            $.notify("john returns card from hand to top of his deck", "me");
        }
    }

    function removeFromDeck(card) {
        card.removeClass("in-deck");
        card.removeClass("face-down");
        card.find(".text").html(card.attr("card-name"));
        card.addClass(card.attr("faction"));

        var cardsRemaining = updateDeckSizeCounter();
        if (cardsRemaining > 0) {
            spawnCardInDeck();
        }
    }

    function addToHand(card) {
        card.addClass("in-hand");
        updateHandSizeCounter();
        if (card.attr("prev") == "board") {
            $.notify("john returns '" + $(".text", card).html() + "' to his hand", "me");
        }
        if (card.attr("prev") == "deck") {
            $.notify("john draws a card", "me");
        }
    }

    function removeFromHand(card) {
        card.removeClass("in-hand");
        updateHandSizeCounter();
    }

    function updateHandSizeCounter() {
        var allInHand = $(".in-hand");
        var count = allInHand.size();
        $("#hand-count").html(count);
    }

    function updateDeckSizeCounter() {
        $("#deck-count").html(deck.length);
        return deck.length;
    }

    function updateLocation(card) {
        if (card.hasClass("in-hand")) {
            card.attr("prev", "hand");
        } else if (card.hasClass("on-board")) {
            card.attr("prev", "board");
        } else if (card.hasClass("in-deck")) {
            card.attr("prev", "deck");
        }
    }

    function createCard(name, suit, imageId) {
        var card = $(CARD);
        card.attr("card-name", name);
        card.attr("faction", suit);
        card.attr("image-id", imageId);
        card.attr("id", id++);

        card.draggable({
            start: function(event, ui) {
                updateLocation($(this));
            },
        });

        card.hover(
            showCardImage,
            hideCardImage
        );
        return card;
    }

    function spawnCardInDeck() {
        var name = deck.splice(0, 1);
        var suit = suits.splice(0, 1);
        var imageId = imageIds.splice(0, 1);
        var card = createCard(name, suit, imageId);
        $body.append(card.addClass("in-deck").addClass("face-down").css({ position: "absolute", top: $deckTop, left: $deckLeft }));
    }

    updateDeckSizeCounter();
    spawnCardInDeck();

    function imageUrl(imageId) {
        return "http://netrunnercards.info/web/bundles/netrunnerdbcards/images/cards/300x418/" + imageId + ".png";
    }

    function showCardImage() {
        var card = $(this);
        if (!card.hasClass("in-deck")) {
            var imageId = card.attr("image-id");
            $("#card-image").attr("src", imageUrl(imageId));
        }
    }

    function hideCardImage() {
    }
    // for more details re notifications see http://notifyjs.com/
    $.notify.addStyle('anr', {
        html: "<div><span data-notify-text/></div>",
        classes: {
            base: {
                "white-space": "nowrap",
                "background-color": "white",
                "padding": "5px"
            },
            me: {
                "border-left": "3px solid gray",
            }
        }
    });
    $.notify.defaults({
        style: 'anr',
        autoHideDelay: 3000,
        globalPosition: 'top left'
    });

});
