import Ember from "ember";
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

const originalDebug = Ember.Logger.debug;

moduleForAcceptance('04 - Components Acceptance Tests', {
  beforeEach() {
    window.confirm = function() {
      return true;
    };
  }
});

test("04 - Components - 01 - Should log on index", function (assert) {
  assert.expect(5);

  Ember.Logger.debug = function(){
    let args = Array.prototype.slice.call(arguments);
    assert.equal(args.join(' '), "akira - favorite: true");
    originalDebug(...arguments);
  };

  visit('/comics/akira');
  andThen(() => {
    let $favComic = find(".btn-fav");
    assert.equal($favComic.length, 1, "Fav btn exists");
    assert.equal(find(".btn-fav.selected").length, 0, "Fav btn unselected");

    click(".btn-fav");
    andThen(() => {
      assert.equal(currentRouteName(), 'comic.index', "Route name is correct");
      assert.equal(find(".btn-fav.selected").length, 1, "Fav btn selected");
      Ember.Logger.debug = originalDebug;
    });
  });
});

test("04 - Components - 02 - Should log on edit", function (assert) {
  assert.expect(5);

  Ember.Logger.debug = function(){
    let args = Array.prototype.slice.call(arguments);
    assert.equal(args.join(' '), "akira - favorite: true");
    originalDebug(...arguments);
  };

  visit('/comics/akira/edit');
  andThen(() => {
    let $favComic = find(".btn-fav");
    assert.equal($favComic.length, 1, "Fav btn exists");
    assert.equal(find(".btn-fav.selected").length, 0, "Fav btn unselected");

    click(".btn-fav");
    andThen(() => {
      assert.equal(currentRouteName(), 'comic.edit', "Route name is correct");
      assert.equal(find(".btn-fav.selected").length, 1, "Fav btn selected");
      Ember.Logger.debug = originalDebug;
    });
  });
});

test("04 - Components - 03 - Image cover should fallback", function (assert) {
  visit('/comics/create');
  andThen(() => {
    var done = assert.async();
    Ember.run.later(function(){
      done();
      assert.equal(find(".cover").attr("src"), "/assets/images/comics/covers/default.jpg", "Fallback loaded");
    }, 100);
  });
});

test("04 - Components - 04 - Image cover should change if model changes", function (assert) {
  visit('/comics/create');
  andThen(() => {
    var done = assert.async();
    Ember.run.later(function(){
      done();
      assert.equal(find(".cover").attr("src"), "/assets/images/comics/covers/default.jpg", "Fallback loaded");

      fillIn(".selected-comic form #title", 'Akira');
      andThen(function() {
        var doneFillIn = assert.async();
        Ember.run.later(function(){
          doneFillIn();
          assert.equal(find(".cover").attr("src"), "/assets/images/comics/covers/akira.jpg", "Cover updated");
        }, 100);
      });
    }, 100);
  });
});
