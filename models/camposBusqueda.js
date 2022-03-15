const camposBusqueda = [
  {
    tipo: 'tweet.fields',
    campos: [
      'attachments',
      'author_id',
      'context_annotations',
      'created_at',
      'entities',
      'geo',
      'id',
      'in_reply_to_user_id',
      'lang',
      'possibly_sensitive',
      'public_metrics',
      'referenced_tweets',
      'source',
      'text',
      'withheld',
    ],
  },
  {
    tipo: 'expansions',
    campos: [
      'referenced_tweets.id',
      'referenced_tweets.id.author_id',
      'author_id,geo.place_id',
      'attachments.media_keys',
      'attachments.poll_ids',
      'entities.mentions.username',
      'in_reply_to_user',
    ],
  },
  {
    tipo: 'media.fields',
    campos: [
      'duration_ms',
      'height',
      'media_key',
      'preview_image_url',
      'public_metrics',
      'type',
      'url',
      'width',
      'alt_text',
    ],
  },
  {
    tipo: 'user.fields',
    campos: [
      'created_at',
      'description',
      'entities',
      'id',
      'location',
      'name',
      'pinned_tweet_id',
      'profile_image_url',
      'protected',
      'url',
      'username',
      'verified',
      'withheld',
      'public_metrics',
    ],
  },
  {
    tipo: 'place.fields',
    campos: ['contained_within', 'country', 'country_code', 'full_name', 'geo', 'id', 'name', 'place_type'],
  },
  {
    tipo: 'poll.fields',
    campos: ['duration_minutes', 'end_datetime', 'id', 'options', 'voting_status'],
  },
];

const url = camposBusqueda.map((campo, i) => {
  return `${campo.tipo}=${campo.campos.join(',')}`;
});

module.exports = url.join('&');
